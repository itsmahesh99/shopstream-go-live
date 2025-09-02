import { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function JoinForm() {
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState({
    name: "",
    roomCode: ""
  });
  const [isJoining, setIsJoining] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    
    const {
      name: userName = '',
      roomCode = '',
    } = inputValues;

    try {
      // Use room code to fetch auth token
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

      // Join the room
      await hmsActions.join({ userName, authToken });
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Join Live Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={inputValues.name}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                name="roomCode"
                type="text"
                placeholder="Enter room code"
                value={inputValues.roomCode}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default JoinForm;
