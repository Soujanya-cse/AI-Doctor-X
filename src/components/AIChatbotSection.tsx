import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { DEMO_USER_ID } from '@/lib/constants';
import { motion } from 'framer-motion';
import { useModelContext } from '@/context/ModelContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  content: string;
  isFromAI: boolean;
  timestamp: string;
}

export default function AIChatbotSection() {
  const { selectedDisease, diseases, progression, currentMonth } = useModelContext();
  const { toast } = useToast();
  
  // Get selected disease info
  const diseaseInfo = diseases.find(d => d.id === selectedDisease);
  
  // Initial greeting based on selected disease
  const getInitialGreeting = (): string => {
    if (!diseaseInfo) {
      return "Hello! I'm your AI medical assistant. How can I help you today?";
    }
    
    return `Hello! I'm your AI medical assistant. Based on your scan results, I've detected signs of ${diseaseInfo.name.toLowerCase()}. Would you like me to explain more about this condition or suggest some management options?`;
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      content: getInitialGreeting(),
      isFromAI: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasAttemptedOpenAI, setHasAttemptedOpenAI] = useState(false);
  
  // Scroll to bottom of messages (contained within chat)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Predefined AI responses based on the selected disease
  const getDemoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // If no disease is selected, provide general health advice
    if (!diseaseInfo) {
      if (lowerMessage.includes('disease') || lowerMessage.includes('diagnosis') || lowerMessage.includes('condition')) {
        return "To get a proper disease analysis, please use the disease detection scanner on the left panel or select a condition from the dropdown menu.";
      }
      
      if (lowerMessage.includes('help') || lowerMessage.includes('features')) {
        return "Doctor X offers several features: disease simulation, progression timeline, AR visualization, and AI-powered health analysis. Start by selecting a disease to simulate or running a full body scan.";
      }
      
      return "I'm your AI medical assistant. To provide personalized advice, please select a condition from the dropdown menu or run a full body scan. How else can I assist you today?";
    }
    
    // For existing disease info - return personalized responses
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
      return `${diseaseInfo.name} is ${diseaseInfo.description} I've detected symptoms that match this condition in your latest scan. Would you like to know more about treatment options or progression?`;
    }
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache') || lowerMessage.includes('symptoms')) {
      return `Based on your scan results, ${diseaseInfo.name} typically presents with these symptoms: ${diseaseInfo.symptoms.join(', ')}. The severity level shown in your scan is ${progression?.currentSeverity || 'mild'} out of 10. Would you like me to suggest management options?`;
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('physical') || lowerMessage.includes('therapy')) {
      if (diseaseInfo.id === 'heartDisease') {
        return "For heart disease, I recommend carefully monitored cardiovascular exercise starting with walking 20-30 minutes daily. Swimming and stationary cycling are also excellent low-impact options. Always check with your cardiologist before starting any exercise program.";
      } else if (diseaseInfo.id === 'brainTumor') {
        return "With your brain tumor diagnosis, gentle activities like short walks and light stretching are appropriate. Avoid high-intensity exercise, contact sports, or activities that risk head injury. Physical therapy focused on maintaining function is recommended.";
      } else if (diseaseInfo.id === 'liverDisease') {
        return "For liver disease, moderate exercise like walking, swimming, or gentle yoga can help improve liver function. Avoid strenuous activities that might strain your body. Maintaining consistent activity levels without overexertion is key.";
      } else if (diseaseInfo.id === 'lungDisease') {
        return "With pulmonary disease, pulmonary rehabilitation exercises including breathing techniques, energy conservation, and gradual aerobic conditioning are beneficial. Start with 5-10 minutes daily and gradually increase as tolerated.";
      } else {
        return "For your condition, I recommend low-impact activities. Start with gentle range-of-motion exercises and gradually increase intensity as tolerated. Swimming, cycling, or using an elliptical machine can be beneficial while minimizing stress on affected areas.";
      }
    }
    
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('drug') || lowerMessage.includes('treatment')) {
      const recommendations = diseaseInfo.recommendations.filter(r => 
        r.toLowerCase().includes('medication') || 
        r.toLowerCase().includes('medicine') || 
        r.toLowerCase().includes('treatment')
      );
      
      if (recommendations.length > 0) {
        return `For ${diseaseInfo.name}, treatment typically includes: ${recommendations.join(', ')}. Always consult with your healthcare provider before starting any new medication.`;
      }
      
      return `Treatment for ${diseaseInfo.name} is typically personalized based on severity and progression. Based on your scan results showing severity level ${progression?.currentSeverity || 'mild'}, I'd recommend discussing specific medication options with your healthcare provider.`;
    }
    
    if (lowerMessage.includes('surgery') || lowerMessage.includes('operation')) {
      if (diseaseInfo.id === 'brainTumor') {
        return "Surgery is often considered for brain tumors depending on size, location, and type. Your scan shows a tumor that may require surgical evaluation. I recommend consulting with a neurosurgeon to discuss surgical options, risks, and potential benefits.";
      } else if (progression && progression.currentSeverity > 6) {
        return `For advanced ${diseaseInfo.name} showing high severity (${progression.currentSeverity}/10), surgical intervention might be considered when conservative treatments aren't effective. I'd recommend discussing surgical options with a specialist.`;
      } else {
        return `At your current severity level of ${progression?.currentSeverity || 'mild'}/10, surgery for ${diseaseInfo.name} isn't typically the first recommendation. Focus on non-surgical approaches first, such as lifestyle modifications and medication management.`;
      }
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('nutrition')) {
      if (diseaseInfo.id === 'heartDisease') {
        return "For heart disease, I recommend a Mediterranean diet rich in fruits, vegetables, whole grains, fish, and olive oil. Limit saturated fats, processed foods, and sodium. This eating pattern has been shown to reduce cardiovascular risk.";
      } else if (diseaseInfo.id === 'liverDisease') {
        return "With liver disease, focus on a low-fat, high-fiber diet with plenty of fruits and vegetables. Avoid alcohol completely. Limit processed foods and those high in added sugars. Stay well-hydrated and consume adequate protein from plant sources or lean meats.";
      } else if (diseaseInfo.id === 'lungDisease') {
        return "For pulmonary disease, eat smaller, more frequent meals that are nutrient-dense. Include foods high in antioxidants like berries and leafy greens. Maintain adequate protein intake and stay well-hydrated. Some people with lung disease find that dairy can increase mucus production.";
      } else {
        return "A balanced anti-inflammatory diet can help with many conditions. Focus on colorful fruits and vegetables, omega-3 rich foods like salmon and flaxseeds, and whole grains. Limit processed foods, added sugars, and saturated fats. Maintaining healthy weight is also important to reduce stress on your body.";
      }
    }
    
    if (lowerMessage.includes('worse') || lowerMessage.includes('progress') || lowerMessage.includes('future') || lowerMessage.includes('timeline')) {
      return `Based on our simulation, ${diseaseInfo.name} with your current severity of ${progression?.currentSeverity || 'mild'}/10 typically progresses gradually over time. At month ${currentMonth}, we're seeing involvement of these organs: ${progression?.affectedOrgans.map(o => o.organName).join(', ')}. With proper management following the recommended treatments, many patients can significantly slow progression and maintain quality of life.`;
    }
    
    if (lowerMessage.includes('cure') || lowerMessage.includes('recovery')) {
      if (diseaseInfo.id === 'brainTumor') {
        return "Treatment success for brain tumors varies widely depending on the type, size, location, and grade. Some tumors can be successfully treated with a combination of surgery, radiation, and chemotherapy, while others may be managed as chronic conditions.";
      } else if (diseaseInfo.id === 'heartDisease' || diseaseInfo.id === 'liverDisease' || diseaseInfo.id === 'lungDisease') {
        return `While ${diseaseInfo.name} is often a chronic condition without a complete cure, many people successfully manage it with proper treatment and lifestyle modifications. Your prognosis can improve significantly with adherence to the recommended treatments.`;
      } else {
        return "With appropriate management and following your treatment plan, many people with your condition maintain good quality of life and slow disease progression. Focus on the recommended lifestyle modifications and treatment plan.";
      }
    }
    
    // Try to use one of the disease recommendations if nothing else matches
    if (diseaseInfo.recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * diseaseInfo.recommendations.length);
      return `Based on your diagnosis of ${diseaseInfo.name}, one key recommendation is: ${diseaseInfo.recommendations[randomIndex]}. Would you like more specific information about managing your condition?`;
    }
    
    // Default response
    return `Thank you for your question about ${diseaseInfo.name}. Based on your current condition severity of ${progression?.currentSeverity || 'mild'}/10, I recommend following the treatment suggestions in your health plan. Is there a specific aspect of your condition you'd like to know more about?`;
  };
  
  // Try to use OpenAI if available, otherwise fallback to predefined responses
  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (!hasAttemptedOpenAI) {
      try {
        setHasAttemptedOpenAI(true);
        
        // Create prompt with context from disease and progression
        const systemPrompt = diseaseInfo 
          ? `You are Dr. X, an AI medical assistant specializing in ${diseaseInfo.name}. 
             The patient has been diagnosed with ${diseaseInfo.name} (${diseaseInfo.description}) 
             with a current severity of ${progression?.currentSeverity || 'mild'}/10. 
             The symptoms include: ${diseaseInfo.symptoms.join(', ')}. 
             Current treatment recommendations: ${diseaseInfo.recommendations.join(', ')}.
             Affected organs include: ${progression?.affectedOrgans.map(o => o.organName).join(', ') || 'N/A'}.
             Month of progression: ${currentMonth}.
             Respond in a medical professional tone, but be empathetic and conversational.`
          : `You are Dr. X, an AI medical assistant. The patient has not yet been diagnosed with any specific condition.
             Guide them to select a condition from the app interface or run a full body scan to get personalized advice.
             Respond in a medical professional tone, but be empathetic and conversational.`;
        
        // Make API request (this would be handled by server-side code in production)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ],
            max_tokens: 500
          })
        });
        
        // If OpenAI request is successful, return the response
        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (error) {
        // If OpenAI request fails, fall back to predefined responses
        console.log("Using fallback responses instead of OpenAI");
      }
    }
    
    // Fallback to predefined responses
    return getDemoResponse(userMessage);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmitting) return;
    
    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isFromAI: false,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSubmitting(true);
    
    // Show typing indicator
    setMessages(prev => [...prev, {
      content: "...",
      isFromAI: true,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      // Get AI response (either from OpenAI or predefined responses)
      const response = await getAIResponse(inputValue);
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== "...");
        return [...filtered, {
          content: response,
          isFromAI: true,
          timestamp: new Date().toISOString()
        }];
      });
    } catch (error) {
      // Handle error
      toast({
        title: "Error getting response",
        description: "Could not get a response from the AI. Please try again.",
        variant: "destructive"
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.content !== "..."));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Quick response suggestions based on current disease
  const getQuickResponses = (): string[] => {
    if (!diseaseInfo) {
      return ["What can Doctor X do?", "How do I get started?", "What diseases can I simulate?"];
    }
    
    return [
      `What are the symptoms of ${diseaseInfo.name}?`,
      "What treatment options are available?",
      "How might this condition progress?",
      "What lifestyle changes should I make?"
    ];
  };

  // Update initial message when disease selection changes
  useEffect(() => {
    if (diseaseInfo && messages.length === 1) {
      setMessages([{
        content: getInitialGreeting(),
        isFromAI: true,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [selectedDisease]);

  return (
    <section id="chatbot" className="mb-10">
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
                <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"></path>
                <path d="M15 2v5h5"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Dr. X AI Assistant</h3>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-white/60">Active now</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="text-white/70 hover:text-primary p-1" 
              onClick={() => {
                // Clear chat history
                setMessages([{
                  content: getInitialGreeting(),
                  isFromAI: true,
                  timestamp: new Date().toISOString()
                }]);
              }}
              title="Clear conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            
            <button className="text-white/70 hover:text-primary p-1" title="AI Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="h-60 overflow-y-auto mb-4 space-y-4 pr-2 chat-container scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
          {messages.map((message, index) => (
            <motion.div 
              key={index}
              className={`flex items-start ${message.isFromAI ? '' : 'justify-end'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.isFromAI && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
              )}
              
              <div className={`${message.isFromAI 
                ? message.content === "..." 
                  ? "bg-dark-blue/30 rounded-lg rounded-tl-none px-5 py-2" 
                  : "bg-dark-blue/50 rounded-lg rounded-tl-none p-3" 
                : "bg-primary/10 border border-primary/30 rounded-lg rounded-tr-none p-3"} max-w-[80%]`}>
                
                {message.content === "..." ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-white/90">
                      {message.content}
                    </p>
                    <span className="text-xs text-white/40 mt-1 block">{formatTime(message.timestamp)}</span>
                  </>
                )}
              </div>
              
              {!message.isFromAI && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent ml-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick replies */}
        {messages.length < 3 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {getQuickResponses().map((question, index) => (
              <button
                key={index}
                className="text-xs py-1.5 px-3 rounded-full bg-dark-blue hover:bg-light-blue transition text-white/80"
                onClick={() => {
                  setInputValue(question);
                  // Submit the form programmatically after a short delay
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <input 
            type="text" 
            placeholder={isSubmitting ? "Doctor X is typing..." : "Ask me anything about your health..."}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 bg-black rounded-l-lg border border-primary/20 focus:border-primary/50 outline-none text-white"
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-dark p-2 rounded-r-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
            )}
          </button>
        </form>
        
        <div className="mt-2 text-xs text-center text-white/40">
          Dr. X is an AI assistant and may produce inaccurate information. 
          <br />Always consult with healthcare professionals for medical advice.
        </div>
      </div>
    </section>
  );
}