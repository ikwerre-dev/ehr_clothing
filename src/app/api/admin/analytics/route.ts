import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Order, Product, Category } from '@prisma/client/wasm'


type ProductWithOrderItems = Product & {
  orderItems: Array<{
    price: number;
    quantity: number;
    order: Order;
  }>;
  _count: {
    orderItems: number;
  };
  images: string[];
}

type CategoryWithProducts = Category & {
  products: Array<{
    orderItems: Array<{
      price: number;
      quantity: number;
      order: Order;
    }>;
  }>;
}


type AnalyticsResponse = {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
  };
  salesTrend: {
    labels: string[];
    data: number[];
  };
  salesByCategory: {
    labels: string[];
    data: number[];
  };
  customerTypes: {
    new: number;
    returning: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string | null;
    sales: number;
    percentageOfSales: number;
  }>;
}

export async function GET(request: Request) {
  try {
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7days'

    // Calculate date range based on timeRange
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30days':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90days':
        startDate.setDate(endDate.getDate() - 90)
        break
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }

    // Get all data in parallel
    const [
      revenueData,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      salesByDay,
      salesByCategory,
      customerTypes,
      topProducts
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          paymentStatus: 'PAID'

        },

        _sum: {
          total: true
        }
      }),

      // Total orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          paymentStatus: 'PAID'

        }
      }),

      // Total customers
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          role: 'USER'
        }
      }),

      // Average order value
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          paymentStatus: 'PAID'

        },
        _avg: {
          total: true
        }
      }),

      // Sales by day
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          paymentStatus: 'PAID'

        },
        _sum: {
          total: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // Sales by category
      prisma.category.findMany({
        where: {
          products: {
            some: {
              orderItems: {
                some: {
                  order: {
                    createdAt: {
                      gte: startDate,
                      lte: endDate
                    }, paymentStatus: 'PAID',
                  }
                }
              }
            }
          }
        },
        include: {
          products: {
            include: {
              orderItems: {
                where: {
                  order: {
                    createdAt: {
                      gte: startDate,
                      lte: endDate
                    }, paymentStatus: 'PAID',
                  }
                },
                include: {
                  order: true
                }
              }
            }
          }
        }
      }),

      // Customer types (new vs returning)
      prisma.$transaction([
        // New customers
        prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            role: 'USER',
            orders: {
              none: {
                createdAt: {
                  lt: startDate
                }
              }
            }
          }
        }),
        // Returning customers
        prisma.user.count({
          where: {
            role: 'USER',
            orders: {
              some: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }, paymentStatus: 'PAID',
              }
            },
            AND: {
              orders: {
                some: {
                  createdAt: {
                    lt: startDate
                  }, paymentStatus: 'PAID',
                }
              }
            }
          }
        })
      ]),

      // Top products
      prisma.product.findMany({
        take: 5,
        where: {
          orderItems: {
            some: {
              order: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }, paymentStatus: 'PAID',
              }
            }
          }
        },
        include: {
          orderItems: {
            where: {
              order: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }, paymentStatus: 'PAID',
              }
            }
          },
          _count: {
            select: {
              orderItems: {
                where: {
                  order: {
                    createdAt: {
                      gte: startDate,
                      lte: endDate
                    }, paymentStatus: 'PAID',
                  }
                }
              }
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        }
      })
    ])

    // Process sales by day for chart
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const salesByDayMap = new Map<string, number>()

    // Initialize with zeros
    if (timeRange === '7days') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayName = daysOfWeek[date.getDay()]
        salesByDayMap.set(dayName, 0)
      }
    }

    // Fill with actual data
    // Add this interface near the top with other type definitions
    interface DailySales {
      createdAt: Date;
      _sum: {
        total: number | null;
      };
    }

    // Update the forEach loop with the proper type
    salesByDay.forEach((day: DailySales) => {
      const date = new Date(day.createdAt)
      const dayName = daysOfWeek[date.getDay()]
      if (salesByDayMap.has(dayName)) {
        salesByDayMap.set(dayName, (salesByDayMap.get(dayName) || 0) + (day._sum.total || 0))
      } else {
        salesByDayMap.set(dayName, day._sum.total || 0)
      }
    })

    // Process sales by category
    const salesByCategories = salesByCategory.map((category: CategoryWithProducts) => {
      const totalSales = category.products.reduce((sum, product) => {
        const productSales = product.orderItems.reduce((total, item) => {
          return total + (item.price * item.quantity)
        }, 0)
        return sum + productSales
      }, 0)

      return {
        name: category.name,
        sales: totalSales
      }
    }).sort((a: { name: string, sales: number }, b: { name: string, sales: number }) => b.sales - a.sales).slice(0, 5)

    // Process top products
    const formattedTopProducts = topProducts.map((product: ProductWithOrderItems) => {
      const totalSales = product.orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      const totalRevenueAmount = revenueData._sum.total || 1
      const percentageOfSales = totalRevenueAmount > 0 ? (totalSales / totalRevenueAmount) * 100 : 0

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || null,
        sales: product._count.orderItems,
        percentageOfSales: Math.round(percentageOfSales)
      }
    })

    return NextResponse.json({
      stats: {
        totalRevenue: revenueData._sum.total || 0,
        totalOrders,
        totalCustomers,
        avgOrderValue: avgOrderValue._avg.total || 0
      },
      salesTrend: {
        labels: Array.from(salesByDayMap.keys()),
        data: Array.from(salesByDayMap.values())
      },
      salesByCategory: {
        labels: salesByCategories.map((c: { name: string, sales: number }) => c.name),
        data: salesByCategories.map((c: { name: string, sales: number }) => c.sales)
      },
      customerTypes: {
        new: customerTypes[0],
        returning: customerTypes[1]
      },
      topProducts: formattedTopProducts
    } as AnalyticsResponse)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}