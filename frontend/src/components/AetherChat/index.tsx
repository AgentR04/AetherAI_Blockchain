import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { initializeGemini, generateAIResponse, formatAIResponse, ChatMessage } from '../../utils/gemini';

const ChatContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  height: '400px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(140, 82, 255, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#8c52ff',
    borderRadius: '4px',
  },
}));

const Message = styled(Box)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(2),
  maxWidth: '80%',
  width: 'fit-content',
  background: isUser
    ? 'linear-gradient(145deg, rgba(140, 82, 255, 0.2), rgba(93, 53, 176, 0.2))'
    : 'linear-gradient(145deg, rgba(38,38,38,0.9), rgba(26,26,26,0.9))',
  marginLeft: isUser ? 'auto' : '0',
  border: '1px solid rgba(140, 82, 255, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  background: 'linear-gradient(145deg, rgba(38,38,38,0.9), rgba(26,26,26,0.9))',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(140, 82, 255, 0.1)',
}));

const AetherChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const model = initializeGemini();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(model, input);
      const formattedResponse = formatAIResponse(aiResponse);

      setMessages(prev => [
        ...prev,
        {
          text: formattedResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            <Typography variant="body1">
              {message.text}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 1, 
                color: 'text.secondary',
                textAlign: message.isUser ? 'right' : 'left'
              }}
            >
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatContainer>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask anything about blockchain and crypto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(140, 82, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(140, 82, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8c52ff',
                },
              },
            }}
          />
          <IconButton 
            type="submit" 
            disabled={isLoading || !input.trim()}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(140, 82, 255, 0.1)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </InputContainer>
      </form>
    </Box>
  );
};

export default AetherChat;
