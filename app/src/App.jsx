import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY = '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'

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Yung Mula Baby!",
      sender: "ChatGPT"
  }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    }
  

  const newMessages = [...messages, newMessage]; // all the old messages, + new message

  // Update our messages state
  setMessages(newMessages);

  // set a typing indicator
  setTyping(true);
  // process message to chatGPT (send it over and see the response)
  await processMessageToChatGPT(newMessages);

  }

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages {sender: "user" or "chatGPT", message: "message content here"}
    // apiMessages { role: "user" or "assistant", content: "messages content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role="assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message}
    });

    // role: "user" -> a messager from the user, "assistant" -> response from chatGPT
    // "system" -> generally one initial message defining HOW  we want chatgpt to talk

    const systemMessage = {
      role: "system",
      content: "Speak like a pirate." // Speak like a pirate, Explain like i am 10 year experienced developer
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className='App'>
      <div style={{ position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Yung Mula is typing" /> : null}
            >
              {messages.map((message,i) => {
                return <Message key={i} model={message}/>
              })}

            </MessageList>
            <MessageInput placeholder='Type your message' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
