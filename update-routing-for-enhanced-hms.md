# Update Routing for Enhanced HMS Components

## Current Routing
The current live stream viewer route in `src/App.tsx` is:

```tsx
<Route 
  path="/livestream/:id" 
  element={<LiveStreamViewerPage />} 
/>
```

## Enhanced Routing Options

### Option 1: Replace Existing Route (Recommended)
Update the existing route to use the enhanced viewer:

```tsx
// Import the enhanced component
const LiveStreamViewerEnhanced = React.lazy(() => import("./components/live-stream/LiveStreamViewerEnhanced"));

// Replace the route
<Route 
  path="/livestream/:id" 
  element={<LiveStreamViewerEnhanced />} 
/>
```

### Option 2: Add New Route (For Testing)
Keep the old route and add a new one for testing:

```tsx
// Import both components
const LiveStreamViewerPage = React.lazy(() => import("./pages/LiveStreamViewerPage"));
const LiveStreamViewerEnhanced = React.lazy(() => import("./components/live-stream/LiveStreamViewerEnhanced"));

// Keep existing route
<Route 
  path="/livestream/:id" 
  element={<LiveStreamViewerPage />} 
/>

// Add new enhanced route
<Route 
  path="/livestream-enhanced/:id" 
  element={<LiveStreamViewerEnhanced />} 
/>
```

### Option 3: Update Customer Live Discovery
Also update the customer live page to use the enhanced version:

```tsx
// Import enhanced discovery page
const CustomerLivePageEnhanced = React.lazy(() => import("./pages/CustomerLivePageEnhanced"));

// Update the /play route (or add new route)
<Route 
  path="/play" 
  element={
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLivePageEnhanced />
    </ProtectedRoute>
  } 
/>
```

## Implementation Steps

### Step 1: Update Imports
Add the enhanced components to the lazy loading section:

```tsx
// Add these imports near the other lazy loaded components
const LiveStreamViewerEnhanced = React.lazy(() => import("./components/live-stream/LiveStreamViewerEnhanced"));
const CustomerLivePageEnhanced = React.lazy(() => import("./pages/CustomerLivePageEnhanced"));
```

### Step 2: Update Routes
Replace or add the routes as needed based on your preference.

### Step 3: Test
1. **Admin Setup**: Configure HMS tokens for an influencer
2. **Customer Test**: Visit the live streams and try watching
3. **Verify**: Check that viewer credentials are being used

## Route Parameters

### LiveStreamViewerEnhanced
- **URL**: `/livestream/:id`
- **Parameter**: `id` - The live stream session ID
- **Usage**: Component automatically fetches session data and HMS credentials

### CustomerLivePageEnhanced  
- **URL**: `/play` (or any discovery route)
- **Features**: Shows live streams with HMS credential status

## Benefits of Enhanced Components

1. **Better User Experience**: Clear status indicators and error messages
2. **Database Integration**: Uses pre-configured HMS credentials
3. **Admin Control**: Respects admin-configured viewer access
4. **Fallback Support**: Gracefully handles missing credentials
5. **Performance**: Optimized connection flow with pre-configured tokens

Choose the option that best fits your deployment strategy!