import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const StyledChatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: theme.spacing(2),
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  maxHeight: 400,
  padding: theme.spacing(2),
  backgroundColor: '#1A1B2A',
  borderRadius: theme.spacing(1),
}));

const MessageBubble = styled(Box)<{ isAi?: boolean }>(({ theme, isAi }) => ({
  backgroundColor: isAi ? '#242538' : '#4A7DFF',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  maxWidth: '80%',
  alignSelf: isAi ? 'flex-start' : 'flex-end',
}));

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  timestamp: string;
  riskAssessment?: {
    score: number;
    confidence: number;
  };
}

const AetherAIWidget = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you with risk assessment, security insights, and liquidity optimization. How can I assist you today?",
      isAi: true,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isAi: false,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I've analyzed your request. Based on current market conditions and your transaction history, here's my assessment:",
        isAi: true,
        timestamp: 'Just now',
        riskAssessment: {
          score: 0.25,
          confidence: 0.95
        }
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <StyledChatBox>
      <MessageList>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.isAi ? 'flex-start' : 'flex-end',
              padding: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              {message.isAi ? (
                <SmartToyIcon fontSize="small" sx={{ color: '#4A7DFF' }} />
              ) : (
                <PersonIcon fontSize="small" sx={{ color: '#4CAF50' }} />
              )}
              <Typography variant="caption" color="text.secondary">
                {message.timestamp}
              </Typography>
            </Box>
            <MessageBubble isAi={message.isAi}>
              <Typography variant="body2" color="white">
                {message.text}
              </Typography>
              {message.riskAssessment && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip
                    label={`Risk: ${(message.riskAssessment.score * 100).toFixed(0)}%`}
                    size="small"
                    sx={{
                      bgcolor: message.riskAssessment.score < 0.3 ? '#4CAF50' : 
                             message.riskAssessment.score < 0.6 ? '#FFA726' : '#FF5252',
                      color: 'white'
                    }}
                  />
                  <Chip
                    label={`Confidence: ${(message.riskAssessment.confidence * 100).toFixed(0)}%`}
                    size="small"
                    sx={{
                      bgcolor: message.riskAssessment.confidence > 0.8 ? '#4CAF50' : '#FFA726',
                      color: 'white'
                    }}
                  />
                </Box>
              )}
            </MessageBubble>
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <CircularProgress size={20} />
          </ListItem>
        )}
      </MessageList>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me anything about security, risk, or liquidity..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: '#242538',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4A7DFF',
              },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            bgcolor: '#4A7DFF',
            color: 'white',
            '&:hover': {
              bgcolor: '#2196F3',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(74, 125, 255, 0.5)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </StyledChatBox>
  );
};

export default AetherAIWidget;
