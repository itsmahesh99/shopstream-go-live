import { LiveStream } from "@/components/live-stream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const LiveStreamDemoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">100ms Live Streaming Integration</h1>
          <p className="text-lg text-gray-600 mb-4">
            Professional live streaming powered by 100ms.live
          </p>
          <Badge variant="default" className="text-sm">
            Real-time Video & Audio
          </Badge>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Streaming Demo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <LiveStream />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    High-quality video streaming with adaptive bitrate and automatic quality adjustment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audio Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Mute/unmute audio with noise cancellation and echo suppression.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Room Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Easy room joining with room codes and user authentication.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Responsive Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Automatically adapts to different screen sizes and device orientations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Multiple Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Support for multiple participants with grid layout and individual controls.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cross Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Works on desktop, mobile, and tablet devices across all major browsers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. Create 100ms Account</h3>
                    <p className="text-gray-600">
                      Sign up at{" "}
                      <a 
                        href="https://dashboard.100ms.live" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        100ms Dashboard
                      </a>{" "}
                      and create a new project.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. Get Room Code</h3>
                    <p className="text-gray-600">
                      Create a room in your 100ms dashboard and get the room code. This will be used to join the live stream.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Configure Roles</h3>
                    <p className="text-gray-600">
                      Set up different roles (host, viewer, participant) with appropriate permissions in your 100ms dashboard.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Test the Integration</h3>
                    <p className="text-gray-600">
                      Use the demo above with your room code. Enter your name and room code to join the live stream.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Components Created:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li><code>LiveStream</code> - Main container component</li>
                      <li><code>JoinForm</code> - Room joining interface</li>
                      <li><code>Conference</code> - Video grid layout</li>
                      <li><code>Peer</code> - Individual participant video</li>
                      <li><code>Footer</code> - Audio/video controls</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">Features Implemented:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      <li>HMSRoomProvider integration</li>
                      <li>Room joining with authentication</li>
                      <li>Video/audio mute controls</li>
                      <li>Responsive participant grid</li>
                      <li>Leave room functionality</li>
                      <li>Connection state management</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveStreamDemoPage;
