import { db } from '@/lib/firebase/config'
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore'
import { analyzeSentiment } from '@/lib/ai/models'

export interface CommunityMember {
  id: string
  displayName: string
  avatar?: string
  bio?: string
  expertise: string[]
  interests: string[]
  contributionPoints: number
  badges: string[]
  joinedAt: string
  lastActive: string
}

export interface CommunityProject {
  id: string
  title: string
  description: string
  category: 'education' | 'support' | 'challenge' | 'initiative'
  creator: string
  members: string[]
  goals: {
    title: string
    description: string
    status: 'pending' | 'in-progress' | 'completed'
  }[]
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'cancelled'
}

export interface Discussion {
  id: string
  projectId: string
  title: string
  content: string
  author: string
  sentiment: 'positive' | 'negative' | 'neutral'
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  replies: {
    id: string
    content: string
    author: string
    createdAt: string
  }[]
}

export interface CommunityExperience {
  member: CommunityMember
  projects: CommunityProject[]
  discussions: Discussion[]
  recommendations: {
    projects: string[]
    members: string[]
    topics: string[]
  }
}

class CommunityEngine {
  private async getMember(userId: string): Promise<CommunityMember | null> {
    try {
      const memberRef = doc(db, 'community_members', userId)
      const memberSnap = await getDoc(memberRef)
      
      if (memberSnap.exists()) {
        return memberSnap.data() as CommunityMember
      }
      return null
    } catch (error) {
      console.error('Error getting member:', error)
      return null
    }
  }

  async createMember(userId: string, data: Partial<CommunityMember>): Promise<CommunityMember> {
    try {
      const existingMember = await this.getMember(userId)
      
      if (existingMember) {
        return existingMember
      }

      const newMember: CommunityMember = {
        id: userId,
        displayName: data.displayName || 'Community Member',
        expertise: data.expertise || [],
        interests: data.interests || [],
        contributionPoints: 0,
        badges: [],
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }

      await setDoc(doc(db, 'community_members', userId), newMember)
      return newMember
    } catch (error) {
      console.error('Error creating member:', error)
      throw new Error('Failed to create member')
    }
  }

  async createProject(creatorId: string, project: Omit<CommunityProject, 'id' | 'creator' | 'members' | 'status'>): Promise<CommunityProject> {
    try {
      const projectData: CommunityProject = {
        id: `proj_${Date.now()}`,
        creator: creatorId,
        members: [creatorId],
        status: 'active',
        ...project
      }

      await setDoc(doc(db, 'community_projects', projectData.id), projectData)
      return projectData
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project')
    }
  }

  async joinProject(userId: string, projectId: string): Promise<void> {
    try {
      const projectRef = doc(db, 'community_projects', projectId)
      await updateDoc(projectRef, {
        members: arrayUnion(userId)
      })

      // Award points for joining a project
      const memberRef = doc(db, 'community_members', userId)
      await updateDoc(memberRef, {
        contributionPoints: arrayUnion(10),
        lastActive: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error joining project:', error)
      throw new Error('Failed to join project')
    }
  }

  async createDiscussion(
    userId: string,
    projectId: string,
    discussion: Omit<Discussion, 'id' | 'author' | 'sentiment' | 'likes' | 'replies' | 'createdAt' | 'updatedAt'>
  ): Promise<Discussion> {
    try {
      // Analyze sentiment of the discussion content
      const sentimentResult = await analyzeSentiment(discussion.content)

      const discussionData: Discussion = {
        id: `disc_${Date.now()}`,
        projectId,
        author: userId,
        sentiment: sentimentResult.sentiment,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...discussion
      }

      await setDoc(doc(db, 'community_discussions', discussionData.id), discussionData)

      // Award points for creating a discussion
      const memberRef = doc(db, 'community_members', userId)
      await updateDoc(memberRef, {
        contributionPoints: arrayUnion(5),
        lastActive: new Date().toISOString()
      })

      return discussionData
    } catch (error) {
      console.error('Error creating discussion:', error)
      throw new Error('Failed to create discussion')
    }
  }

  async addDiscussionReply(userId: string, discussionId: string, content: string): Promise<void> {
    try {
      const discussionRef = doc(db, 'community_discussions', discussionId)
      const reply = {
        id: `reply_${Date.now()}`,
        content,
        author: userId,
        createdAt: new Date().toISOString()
      }

      await updateDoc(discussionRef, {
        replies: arrayUnion(reply),
        updatedAt: new Date().toISOString()
      })

      // Award points for replying
      const memberRef = doc(db, 'community_members', userId)
      await updateDoc(memberRef, {
        contributionPoints: arrayUnion(2),
        lastActive: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error adding reply:', error)
      throw new Error('Failed to add reply')
    }
  }

  async likeDiscussion(userId: string, discussionId: string): Promise<void> {
    try {
      const discussionRef = doc(db, 'community_discussions', discussionId)
      await updateDoc(discussionRef, {
        likes: arrayUnion(userId)
      })
    } catch (error) {
      console.error('Error liking discussion:', error)
      throw new Error('Failed to like discussion')
    }
  }

  async updateMemberProfile(userId: string, updates: Partial<CommunityMember>): Promise<void> {
    try {
      const memberRef = doc(db, 'community_members', userId)
      await updateDoc(memberRef, {
        ...updates,
        lastActive: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating member profile:', error)
      throw new Error('Failed to update member profile')
    }
  }

  async awardBadge(userId: string, badge: string): Promise<void> {
    try {
      const memberRef = doc(db, 'community_members', userId)
      await updateDoc(memberRef, {
        badges: arrayUnion(badge)
      })
    } catch (error) {
      console.error('Error awarding badge:', error)
      throw new Error('Failed to award badge')
    }
  }

  async createCommunityExperience(data: {
    member: Partial<CommunityMember>
    transactions: any[]
    interests: string[]
    goals: string[]
  }): Promise<CommunityExperience> {
    try {
      // Create or get member
      const member = await this.createMember(data.member.id!, data.member)

      // Get relevant projects based on interests and goals
      const projectsQuery = query(
        collection(db, 'community_projects'),
        where('category', 'in', data.interests)
      )
      const projectsSnapshot = await getDocs(projectsQuery)
      const projects = projectsSnapshot.docs.map(doc => doc.data() as CommunityProject)

      // Get relevant discussions
      const discussionsQuery = query(
        collection(db, 'community_discussions'),
        where('tags', 'array-contains-any', data.interests)
      )
      const discussionsSnapshot = await getDocs(discussionsQuery)
      const discussions = discussionsSnapshot.docs.map(doc => doc.data() as Discussion)

      // Generate recommendations based on interests and goals
      const recommendations = {
        projects: projects.slice(0, 3).map(p => p.id),
        members: [], // Implement member recommendations based on similar interests
        topics: data.interests
      }

      return {
        member,
        projects,
        discussions,
        recommendations
      }
    } catch (error) {
      console.error('Error creating community experience:', error)
      throw new Error('Failed to create community experience')
    }
  }
}

export const communityEngine = new CommunityEngine() 