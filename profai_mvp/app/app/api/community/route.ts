/**
 * Community API Route for ProfAI
 * Handles community integration with Hack-Nation channels
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isDemoUser } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'discussions';
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('📢 Getting community content:', type);

    // Demo users get mock community data
    if (isDemoUser(session.user.id)) {
      return NextResponse.json({
        success: true,
        data: getMockCommunityData(type, limit),
        isDemoMode: true
      });
    }

    // Try to get community data with timeout
    try {
      let data;
      
      switch (type) {
        case 'discussions':
          data = await getDiscussions(limit);
          break;
        case 'shared_content':
          data = await getSharedContent(limit);
          break;
        case 'trending':
          data = await getTrendingTopics(limit);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid type parameter' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        data
      });

    } catch (error) {
      console.error('Community data fetch error:', error);
      console.log('⚠️ Fallback to mock community data');
      
      return NextResponse.json({
        success: true,
        data: getMockCommunityData(type, limit),
        isDemoMode: true,
        warning: 'Usando datos de demostración - servicio de comunidad no disponible'
      });
    }

  } catch (error) {
    console.error('Community API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get community data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, content, discussionId, message } = body;

    console.log('📝 Community POST action:', action);

    switch (action) {
      case 'share_content': {
        const shareResult = await shareContent(content, session.user.id);
        return NextResponse.json({
          success: true,
          data: shareResult
        });
      }

      case 'create_discussion': {
        const discussion = await createDiscussion(content, session.user.id);
        return NextResponse.json({
          success: true,
          data: discussion
        });
      }

      case 'add_comment': {
        const comment = await addComment(discussionId, message, session.user.id);
        return NextResponse.json({
          success: true,
          data: comment
        });
      }

      case 'vote': {
        const voteResult = await handleVoting(discussionId, body.voteType, session.user.id);
        return NextResponse.json({
          success: true,
          data: voteResult
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Community POST error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process community action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for community features
function getMockCommunityData(type: string, limit: number) {
  const mockData = {
    discussions: [
      {
        id: 'disc-1',
        title: 'Best practices for prompt engineering?',
        author: 'AI_Enthusiast',
        messages: 23,
        votes: 15,
        tags: ['prompting', 'best-practices'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastActivity: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'disc-2',
        title: 'Understanding transformer architecture',
        author: 'DeepLearner',
        messages: 18,
        votes: 12,
        tags: ['transformers', 'architecture'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        lastActivity: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    shared_content: [
      {
        id: 'share-1',
        title: 'My first AI model deployment',
        type: 'lesson',
        author: 'CodeNewbie',
        likes: 8,
        shares: 3,
        tags: ['deployment', 'beginners'],
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ],
    trending: [
      {
        topic: 'Large Language Models',
        discussions: 15,
        trend: 'up'
      },
      {
        topic: 'Computer Vision',
        discussions: 12,
        trend: 'stable'
      }
    ]
  };

  return (mockData as any)[type] || [];
}

async function getDiscussions(limit: number) {
  // In production, this would query a discussions database/API
  // For demo, return mock data with timeout simulation
  await new Promise(resolve => setTimeout(resolve, 100));
  return getMockCommunityData('discussions', limit);
}

async function getSharedContent(limit: number) {
  // In production, this would query shared content database/API
  await new Promise(resolve => setTimeout(resolve, 100));
  return getMockCommunityData('shared_content', limit);
}

async function getTrendingTopics(limit: number) {
  // In production, this would analyze trending topics
  await new Promise(resolve => setTimeout(resolve, 100));
  return getMockCommunityData('trending', limit);
}

async function shareContent(content: any, userId: string) {
  const shareData = {
    id: `share-${Date.now()}`,
    userId,
    content,
    platform: 'hack-nation',
    shareUrl: `https://profai.dev/shared/${content.id}`,
    timestamp: new Date().toISOString()
  };

  // Mock webhook to Hack-Nation (Discord/Slack integration)
  try {
    console.log('📤 Sharing to Hack-Nation:', shareData);
    // await sendToHackNationWebhook(shareData);
    
    return {
      ...shareData,
      status: 'shared',
      message: 'Content shared successfully to Hack-Nation community!'
    };
  } catch (error) {
    return {
      ...shareData,
      status: 'demo',
      message: 'Demo mode: Content would be shared to community'
    };
  }
}

async function createDiscussion(content: any, userId: string) {
  return {
    id: `discussion-${Date.now()}`,
    title: content.title,
    description: content.description,
    author: userId,
    tags: content.tags || [],
    votes: { up: 0, down: 0 },
    messages: [],
    createdAt: new Date().toISOString(),
    status: 'active'
  };
}

async function addComment(discussionId: string, message: string, userId: string) {
  return {
    id: `comment-${Date.now()}`,
    discussionId,
    message,
    author: userId,
    createdAt: new Date().toISOString(),
    votes: { up: 0, down: 0 }
  };
}

async function handleVoting(discussionId: string, voteType: 'up' | 'down', userId: string) {
  return {
    discussionId,
    voteType,
    userId,
    timestamp: new Date().toISOString(),
    newTotal: Math.floor(Math.random() * 20) // Mock vote count
  };
}
