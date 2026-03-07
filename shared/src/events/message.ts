export interface BridgeMessageEvent {
  roomId: string;
  roomName: string;
  sender: string;
  text: string;
  timestamp: string;
  messageId?: string;
  sourceMetadata?: Record<string, unknown>;
  confidence?: number;
  extractionMode?: 'clipboard' | 'ocr' | 'uiautomation' | 'hybrid';
}

export interface AgentResponseAction {
  roomId: string;
  text: string;
  metadata?: Record<string, unknown>;
}
