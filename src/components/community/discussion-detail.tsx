import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { communityEngine, Discussion } from '@/lib/community/engine'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/useToast'
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

interface DiscussionDetailProps {
  discussion: Discussion
  onUpdate: () => void
}

export function DiscussionDetail({ discussion, onUpdate }: DiscussionDetailProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      await communityEngine.likeDiscussion(user!.uid, discussion.id)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Discussion liked'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like discussion',
        variant: 'destructive'
      })
    }
  }

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Reply content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await communityEngine.addDiscussionReply(user!.uid, discussion.id, replyContent)
      setReplyContent('')
      onUpdate()
      toast({
        title: 'Success',
        description: 'Reply added successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Success',
        description: 'Discussion link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={discussion.author.avatar} />
                <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{discussion.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Posted by {discussion.author} • {new Date(discussion.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={
              discussion.sentiment === 'positive' ? 'default' :
              discussion.sentiment === 'negative' ? 'destructive' : 'secondary'
            }>
              {discussion.sentiment}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">{discussion.content}</p>
            
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                {discussion.likes} Likes
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                {discussion.replies.length} Replies
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleReply} disabled={loading}>
                    {loading ? 'Sending...' : 'Reply'}
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              {discussion.replies.map(reply => (
                <div key={reply.id} className="flex space-x-4 mb-6">
                  <Avatar>
                    <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{reply.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 