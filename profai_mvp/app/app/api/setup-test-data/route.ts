import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🧪 Setting up test data...');
    
    // Just test basic user creation
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User SQLite',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    console.log('✅ Test user created:', testUser.email);

    return NextResponse.json({
      success: true,
      message: '✅ Test data created successfully',
      data: {
        user: testUser.email,
        userId: testUser.id,
        db_working: true
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error creating test data:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      details: error?.toString()
    }, { status: 500 });
  }
}
