'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  TrendingUp,
  Calendar,
  User,
  Hash,
  Send,
  Plus,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunityIntegrationProps {
  className?: string;
}

export function CommunityIntegration({ className }: CommunityIntegrationProps) {
  const [communityData, setCommunityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discussions');
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

  useEffect(() => {
    fetchCommunityData();
  }, [activeTab]);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/community?type=${activeTab}&limit=10`);
      const result = await response.json();
      
      if (result.success) {
        setCommunityData(result.data);
        
        if (result.isDemoMode) {
          toast.info('Showing demo community data');
        }
      }
    } catch (error) {
      toast.error('Error loading community data');
      console.error('Community fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDiscussion = async () => {
    if (!newDiscussion.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_discussion',
          content: {
            title: newDiscussion.title,
            description: newDiscussion.description,
            tags: newDiscussion.tags.split(',').map(t => t.trim()).filter(Boolean)
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Discussion created! 🎉');
        setNewDiscussion({ title: '', description: '', tags: '' });
        setShowNewDiscussion(false);
        await fetchCommunityData();
      }
    } catch (error) {
      toast.error('Error creating discussion');
    }
  };

  const handleVote = async (discussionId: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          discussionId,
          voteType
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(`${voteType === 'up' ? 'Upvote' : 'Downvote'} registered!`);
        await fetchCommunityData();
      }
    } catch (error) {
      toast.error('Error voting');
    }
  };

  const shareToHackNation = async (content: any) => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share_content',
          content: {
            title: content.title || 'Content shared from ProfAI',
            description: content.description || 'Check out this interesting content',
            type: 'shared_lesson'
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Shared on Hack-Nation! 🚀');
      }
    } catch (error) {
      toast.error('Error sharing');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Integration - Hack-Nation
          </CardTitle>
          <Button 
            onClick={() => setShowNewDiscussion(!showNewDiscussion)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Discussion
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showNewDiscussion && (
          <Card className="mb-6 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Create New Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <Input
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your question or discussion topic?"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newDiscussion.description}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more context about your question or topic..."
                  className="w-full min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <Input
                  value={newDiscussion.tags}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="ai, machine-learning, python (comma separated)"
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createDiscussion} className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Create Discussion
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewDiscussion(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="shared_content">Content</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active Discussions</h3>
              <Button size="sm" variant="outline" onClick={fetchCommunityData}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {communityData?.map((discussion: any, index: number) => (
                  <Card key={discussion.id || index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-1">{discussion.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <User className="h-3 w-3" />
                            <span>{discussion.author}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVote(discussion.id, 'up')}
                              className="flex items-center gap-1 h-8"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="text-xs">{discussion.votes || 0}</span>
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MessageSquare className="h-3 w-3" />
                            <span>{discussion.messages || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      {discussion.tags && discussion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {discussion.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Last activity: {new Date(discussion.lastActivity).toLocaleString()}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareToHackNation(discussion)}
                            className="flex items-center gap-1"
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </Button>
                          
                          <Button size="sm" variant="ghost" asChild>
                            <a href="#" className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {communityData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active discussions</p>
                    <Button 
                      className="mt-2" 
                      size="sm" 
                      onClick={() => setShowNewDiscussion(true)}
                    >
                      Be the first to create one!
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared_content" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Shared Content</h3>
              <Button size="sm" variant="outline" onClick={fetchCommunityData}>
                <Share2 className="h-4 w-4 mr-1" />
                Actualizar
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {communityData?.map((content: any, index: number) => (
                  <Card key={content.id || index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-1">{content.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <User className="h-3 w-3" />
                            <span>{content.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{content.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Share2 className="h-3 w-3" />
                            <span>{content.shares || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {content.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Shared: {new Date(content.createdAt).toLocaleDateString()}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVote(content.id, 'up')}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            Like
                          </Button>
                          
                          <Button size="sm" variant="ghost" asChild>
                            <a href="#" className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {communityData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Share2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No shared content</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Trending Topics</h3>
              <Button size="sm" variant="outline" onClick={fetchCommunityData}>
                <TrendingUp className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {communityData?.map((topic: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className={`h-5 w-5 ${
                            topic.trend === 'up' ? 'text-green-500' : 
                            topic.trend === 'down' ? 'text-red-500' : 
                            'text-gray-500'
                          }`} />
                          <div>
                            <h4 className="font-medium">{topic.topic}</h4>
                            <p className="text-sm text-gray-500">
                              {topic.discussions} discussions
                            </p>
                          </div>
                        </div>
                        
                        <Badge variant={
                          topic.trend === 'up' ? 'default' :
                          topic.trend === 'down' ? 'destructive' :
                          'secondary'
                        }>
                          {topic.trend === 'up' ? '📈' : topic.trend === 'down' ? '📉' : '➡️'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {communityData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No trending topics</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Hack-Nation Integration Status */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Connected to Hack-Nation</span>
            <Badge variant="outline" className="text-green-600">
              ● Online
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
