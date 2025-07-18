import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Sparkles, Clock, Wand2, ListMusic, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const moods = [
  'Inspired', 'Nostalgic', 'Curious', 'Hopeful', 'Reflective', 'Motivated',
  'Morning-coffee', 'Commuting', 'Lunch-break', 'Wind-down', 'Group-discussion', 'Workout'
];

interface TalkRecommendation {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
}

interface PlaylistTalk {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

interface TimelineTalk {
  title: string;
  year: number;
  month: number;
  day: number;
  thumbnail: string;
  url: string;
}

// Mock API function
async function fetchGen(action: string, payload: any): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (action) {
    case 'whywatch':
      return {
        text: "A transformative perspective on how small changes in thinking can create massive shifts in outcomes."
      };
    
    case 'recs':
      return {
        list: {
          "Psychology & Personal Growth": [
            {
              title: "The Power of Vulnerability",
              speaker: "Brené Brown",
              url: "https://ted.com/talks/brene_brown_the_power_of_vulnerability",
              thumbnail: "/api/placeholder/200/150"
            },
            {
              title: "Your Body Language May Shape Who You Are",
              speaker: "Amy Cuddy",
              url: "https://ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
              thumbnail: "/api/placeholder/200/150"
            }
          ],
          "Leadership & Innovation": [
            {
              title: "How Great Leaders Inspire Action",
              speaker: "Simon Sinek", 
              url: "https://ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
              thumbnail: "/api/placeholder/200/150"
            }
          ]
        }
      };
    
    case 'playlist':
      return {
        talks: [
          {
            title: "The Puzzle of Motivation",
            speaker: "Dan Pink",
            url: "https://ted.com/talks/dan_pink_the_puzzle_of_motivation", 
            thumbnail: "/api/placeholder/200/150",
            tags: ["motivation", "psychology", "work"]
          },
          {
            title: "How to Make Stress Your Friend",
            speaker: "Kelly McGonigal",
            url: "https://ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
            thumbnail: "/api/placeholder/200/150", 
            tags: ["health", "psychology", "stress"]
          },
          {
            title: "The Happy Secret to Better Work",
            speaker: "Shawn Achor",
            url: "https://ted.com/talks/shawn_achor_the_happy_secret_to_better_work",
            thumbnail: "/api/placeholder/200/150",
            tags: ["happiness", "productivity", "mindset"]
          }
        ] as PlaylistTalk[]
      };
    
    case 'timeline':
      return {
        talks: [
          {
            title: "Machines That Think",
            year: 2015,
            month: 6,
            day: 15,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/machines_that_think"
          },
          {
            title: "The Rise of AI",
            year: 2017,
            month: 3,
            day: 22,
            thumbnail: "/api/placeholder/200/150", 
            url: "https://ted.com/talks/rise_of_ai"
          },
          {
            title: "How AI Can Save Our Humanity", 
            year: 2019,
            month: 11,
            day: 8,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/ai_save_humanity"
          },
          {
            title: "The Future of Human-AI Collaboration",
            year: 2021,
            month: 9,
            day: 12,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/future_human_ai"
          }
        ] as TimelineTalk[]
      };
    
    default:
      throw new Error('Unknown action');
  }
}

const MoodChip: React.FC<{ mood: string; selected: boolean; onClick: () => void }> = ({
  mood, selected, onClick
}) => (
  <button
    onClick={onClick}
    className={`ted-chip ${selected ? 'active' : ''}`}
  >
    {mood}
  </button>
);

const TedExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trace');
  const [loading, setLoading] = useState(false);
  const [talkUrl, setTalkUrl] = useState('');
  const [currentTalk, setCurrentTalk] = useState<{ title: string; thumbnail: string; url: string } | null>(null);
  const [whyWatch, setWhyWatch] = useState('');
  const [recommendations, setRecommendations] = useState<{ [category: string]: TalkRecommendation[] }>({});
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState('');
  const [playlist, setPlaylist] = useState<PlaylistTalk[]>([]);
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineTalk[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!talkUrl.trim()) return;
    
    setLoading(true);
    try {
      const [whyResult, recsResult] = await Promise.all([
        fetchGen('whywatch', { url: talkUrl }),
        fetchGen('recs', { url: talkUrl })
      ]);
      
      // Mock current talk data
      setCurrentTalk({
        title: "The Future of Innovation",
        thumbnail: "/api/placeholder/400/300",
        url: talkUrl
      });
      setWhyWatch(whyResult.text);
      setRecommendations(recsResult.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlaylist = async () => {
    const mood = selectedMoods.join(', ') || customMood;
    if (!mood.trim()) return;
    
    setLoading(true);
    try {
      const result = await fetchGen('playlist', { mood });
      setPlaylist(result.talks);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to generate playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimeline = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const result = await fetchGen('timeline', { topic });
      setTimeline(result.talks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate timeline. Please try again.", 
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TED Suite 2.0</h1>
          <p className="text-lg text-muted-foreground">New ways to T.E.D. ideas worth spreading</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="trace" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Trace
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-8">
            {/* URL Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="Paste or search a TED Talk URL…"
                  value={talkUrl}
                  onChange={(e) => setTalkUrl(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !talkUrl.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </CardContent>
            </Card>

            {/* Current Talk Thumbnail */}
            {currentTalk && (
              <Card className="w-full max-w-2xl mx-auto ted-card">
                <CardContent className="p-0">
                  <a
                    href={currentTalk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={currentTalk.thumbnail}
                      alt={`${currentTalk.title} thumbnail`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    />
                  </a>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{currentTalk.title}</h3>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Why Watch */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>Why Watch?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold italic min-h-[12rem] flex items-center justify-center text-center">
                    {whyWatch || "Your compelling reason to watch will appear here..."}
                  </p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>You might also like…</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.keys(recommendations).length > 0 ? (
                      Object.entries(recommendations).map(([category, recs]) => (
                        <div key={category}>
                          <h4 className="font-medium text-sm mb-3 text-primary">
                            If you're interested in {category}
                          </h4>
                          <div className="space-y-3">
                            {recs.map((rec, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <img
                                  src={rec.thumbnail}
                                  alt={`${rec.title} thumbnail`}
                                  className="w-16 h-12 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-sm line-clamp-2">{rec.title}</h5>
                                  <p className="text-sm text-muted-foreground">{rec.speaker}</p>
                                  <a
                                    href={rec.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-xs hover:underline flex items-center gap-1 mt-1"
                                  >
                                    Watch <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Recommendations will appear here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            {/* Mood Selection Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Pick a mood or activity…</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <MoodChip
                        key={mood}
                        mood={mood}
                        selected={selectedMoods.includes(mood)}
                        onClick={() => toggleMood(mood)}
                      />
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="…or type your own"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                />
                <Button
                  onClick={handleGeneratePlaylist}
                  disabled={loading || (selectedMoods.length === 0 && !customMood.trim())}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <ListMusic className="w-4 h-4" />
                  {loading ? 'Generating playlist...' : 'Generate playlist'}
                </Button>
              </CardContent>
            </Card>

            {/* Playlist Grid */}
            {playlist.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {playlist.map((talk, idx) => (
                  <Card key={idx} className="ted-card">
                    <CardContent className="p-0">
                      <img
                        src={talk.thumbnail}
                        alt={`${talk.title} thumbnail`}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{talk.title}</h3>
                        <p className="text-sm text-muted-foreground">{talk.speaker}</p>
                        <div className="flex flex-wrap gap-1">
                          {talk.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={talk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                        >
                          Watch Talk <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trace Tab */}
          <TabsContent value="trace" className="space-y-8">
            {/* Topic Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter a topic e.g. Artificial Intelligence"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button
                  onClick={handleGenerateTimeline}
                  disabled={loading || !topic.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {loading ? 'Building timeline...' : 'Build timeline'}
                </Button>
              </CardContent>
            </Card>

            {/* Vertical Timeline */}
            {timeline.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-primary h-full"></div>
                  
                  {timeline.map((talk, idx) => (
                    <div key={idx} className={`relative flex items-center mb-12 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                      
                      {/* Content */}
                      <div className={`w-5/12 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <Card className="ted-card">
                          <CardContent className="p-0">
                            <a
                              href={talk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={talk.thumbnail}
                                alt={`${talk.title} thumbnail`}
                                className="w-full h-32 object-cover rounded-t-lg cursor-pointer"
                              />
                            </a>
                            <div className="p-4">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{talk.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {new Date(talk.year, talk.month - 1, talk.day).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TedExplorer;