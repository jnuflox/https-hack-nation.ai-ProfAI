import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🧪 Testing SQLite connection...');
    
    // Test basic connection
    const userCount = await prisma.user.count();
    console.log('✅ Connection successful! Users in DB:', userCount);
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'SQLite connection working!',
      data: {
        userCount,
        users: users.slice(0, 5) // First 5 users
      }
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
