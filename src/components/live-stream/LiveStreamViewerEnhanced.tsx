// HMS functionality moved to WhatnotStyleViewer component
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
// Services moved to WhatnotStyleViewer component
import WhatnotStyleViewer from "./WhatnotStyleViewer";

// This component now uses WhatnotStyleViewer for the main interface

interface LiveStreamViewerEnhancedProps {
  sessionId: string;
  onBack?: () => void;
}

function LiveStreamViewerEnhanced({ sessionId, onBack }: LiveStreamViewerEnhancedProps) {
  // All functionality has been moved to WhatnotStyleViewer component
  // This component now serves as a simple wrapper

  // Main viewer interface - Use Whatnot-style viewer
  return <WhatnotStyleViewer sessionId={sessionId} onBack={onBack} />;
}

export default LiveStreamViewerEnhanced;