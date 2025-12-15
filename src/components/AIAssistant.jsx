import { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your insurance assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Simple response logic - in a real implementation, this would connect to an AI API
    let response = "I'm here to help! Could you provide more details about your question?";
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      response = "Hello there! How can I assist you with your insurance application today?";
    } else if (lowerInput.includes('driver') || lowerInput.includes('license')) {
      response = "To scan your driver's license, click on the 'Scan Driver's License' option on the Driver Information page. The system will automatically fill in your details.";
    } else if (lowerInput.includes('vin') || lowerInput.includes('vehicle')) {
      response = "For vehicle information, you can either look up your VIN number or manually enter your car details on the Vehicle Information page.";
    } else if (lowerInput.includes('coverage') || lowerInput.includes('insurance')) {
      response = "On the Coverage Selection page, you can choose from various coverage options including liability, collision, and comprehensive coverage. Each option protects you in different scenarios.";
    } else if (lowerInput.includes('address') || lowerInput.includes('location')) {
      response = "When entering your address, start typing and you'll see suggestions appear. Select the correct address from the dropdown to auto-fill your information.";
    } else if (lowerInput.includes('thank')) {
      response = "You're welcome! Is there anything else I can help you with?";
    } else if (lowerInput.includes('help')) {
      response = "I can help you with:\n• Driver information and license scanning\n• Vehicle details and VIN lookup\n• Address autocomplete\n• Coverage options\n• Navigation through the application\n\nWhat would you like to know more about?";
    }

    return {
      id: Date.now() + 1,
      text: response,
      sender: 'ai'
    };
  };

  return (
    <div className="ai-assistant">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Insurance Assistant</h3>
            <button className="close-btn" onClick={toggleAssistant}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="2"
            />
            <button onClick={handleSend} className="send-btn">Send</button>
          </div>
        </div>
      )}
      <button className="assistant-toggle" onClick={toggleAssistant}>
        {isOpen ? '−' : '+'}
      </button>
    </div>
  );
};

export default AIAssistant;