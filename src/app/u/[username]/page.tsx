'use client';

import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function PublicProfile() {
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [userInput, setUserInput] = useState('');

  const getSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await axios.post('/api/suggest-messages', { });
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const suggestionsArray = data[0].split(' || ').map((s: string) => s.trim());
        setSuggestions(suggestionsArray);
      } else {
        setSuggestions(['No suggestions available.']);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || error.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('content', suggestion);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: params.username,
        content: data.content,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Unable to send message',
        description:
          axiosError.response?.data.message ?? 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-xl font-bold mb-4 text-center">Public profile link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send message to @{params.username}</FormLabel>
                <Input {...field} className="w-full" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Send</Button>
        </form>
      </Form>
      
      <div className="mt-4 flex flex-col items-center">
        <Button onClick={getSuggestions} disabled={loading} className="w-full">
          {loading ? 'Generating...' : 'Get Message Suggestions'}
        </Button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <div className="mt-4 space-y-2 w-full">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100 text-center w-full"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}