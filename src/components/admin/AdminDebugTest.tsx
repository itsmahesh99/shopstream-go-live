import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const AdminDebugTest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testDirectQuery = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      console.log('Testing direct query to influencers table...');
      
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Direct query error:', error);
        setError(error.message);
      } else {
        console.log('Direct query success:', data);
        setResults(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminFunction = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      console.log('Testing admin RPC function...');
      
      const { data, error } = await supabase.rpc('admin_get_all_influencers');

      if (error) {
        console.error('Admin function error:', error);
        setError(error.message);
      } else {
        console.log('Admin function success:', data);
        setResults(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthContext = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Testing auth context...');
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);

      setResults([{
        auth_user_id: user?.id,
        auth_user_email: user?.email,
        session_exists: !!session,
        session_user_id: session?.user?.id
      }]);
    } catch (err) {
      console.error('Auth context error:', err);
      setError(`Auth error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testDirectQuery} disabled={loading}>
            Test Direct Query
          </Button>
          <Button onClick={testAdminFunction} disabled={loading}>
            Test Admin Function
          </Button>
          <Button onClick={testAuthContext} disabled={loading}>
            Test Auth Context
          </Button>
        </div>

        {loading && <div>Loading...</div>}
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <strong>Results ({results.length} items):</strong>
            <pre className="mt-2 overflow-auto max-h-96 text-xs">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            No results yet. Click a test button above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDebugTest;
