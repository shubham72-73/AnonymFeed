'use client'

import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
interface Suggestion {
  text: string;
}

export default function PublicProfile() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof messageSchema>>({
      resolver: zodResolver(messageSchema),
    });
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userInput, setUserInput] = useState("");

    const getSuggestions = async () => {
      setLoading(true);
      setError(null);
      setSuggestions([]);

      try {
        const response = await axios.post('/api/suggest-messages', { userInput });
        setSuggestions(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || error.message || "Failed to get suggestions");
      } finally {
        setLoading(false);
      }
    }
  
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

        //send user to a message sent successfully page (optional)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Unable to sent message',
          description:
            axiosError.response?.data.message ??
            'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    };


  return (
    <div>
      <h1>Public profile link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send message to @{params.username}</FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />
          <Button type="submit">Send</Button>
        </form>
      </Form> 
      <div>
        
      <button onClick={getSuggestions} disabled={loading}>
        {loading ? 'Generating...' : 'Get Message Suggestions'}
      </button>
      
    </div>
    </div>
  )
}
