import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage, Group, User } from '../../../interfaces/interface';
import { ChatService } from '../../services/chat.service';
import { MessageService } from 'primeng/api';
import { AuthserviceService } from '../../services/authservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit{
  
  selectedUser!: User;
  messages:ChatMessage [] = []
  senderId!: string;
  receiverId!: string
  clients: any[] = [];
  filteredAppointments: any[] = [];
  unreadMessageCounts: Map<string, { count: number, isRead: boolean }> = new Map();
  unreadMessagesCount: number = 0;
  roomId: string = '';
  messageSubscription!: Subscription;
  selectedGroup: Group | null = null;
  groups: Group[] = [];
  newGroupName: string = '';
  showGroupForm: boolean = false;
  sendername: string = ''
  searchQuery: string = '';
  userName!: any 
  messageArray:ChatMessage []= []
  loggedUserId!: any
  currentRoomId!: string
  newMessage: string = ''
  selectedUserIds: string[] = [];
  showEmojiPicker: boolean = false;

  constructor(private chatService: ChatService,
    private route: ActivatedRoute,
    private messageService:MessageService,
    private authService: AuthserviceService,
    private cdr: ChangeDetectorRef,
    private router:Router
) { }
  
async ngOnInit(): Promise<void> {
  try {
      await this.initializePage();
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

    private async initializePage(): Promise<void> {
      const userString = localStorage.getItem('user_id');
      console.log('User ID:', userString);
      
      if (userString) {
        this.senderId = userString;
        await Promise.all([
          this.loadClients(),
          this.loadName()
        ]);
      } else {
        console.error('No user_id found in localStorage');
      }
    }

async loadClients(): Promise<void> {
  try {
    const response = await this.authService.getClients(this.senderId).toPromise();
    this.clients = response.clientList;
    this.joinRoom();
  } catch (error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}

async loadName(): Promise<void> {
  try {
    const response = await this.authService.loadName(this.senderId).toPromise();
    this.userName = response.username.fullName;
    console.log('This is the username', this.userName);
  } catch (error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
    showEmoji(){
      this.showEmojiPicker = !this.showEmojiPicker
    }

    addEmoji(event: any) {
      this.newMessage += event.emoji.native;
    }



    groupmessage(){
      this.router.navigate(['group'])
    }

    onSearch(event: Event) {
      
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        const searchTerm = this.searchQuery.trim();
        if (searchTerm) {
          this.filteredAppointments = this.clients.filter((appointment) =>
            appointment.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          this.clients = [...this.filteredAppointments]; // Update the Appointment array
        } else {
          this.loadClients(); // Reset to all nutritionists if no search term
        }
      }
    }


    ngOnDestroy(): void {
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
    }
  
    toggleGroupForm() {
      this.showGroupForm = !this.showGroupForm;
    }

    toggleUserSelection(userId: string, event:Event) {
      const checkbox = event.target as HTMLInputElement;
      const isChecked = checkbox.checked;
      if (isChecked) {
        this.selectedUserIds.push(userId);
      } else {
        this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
      }
    }

    createGroup() {
      if (this.newGroupName.trim()  && this.selectedUserIds.length > 0) {
        // Call the backend service to create the group
        this.authService.createGroup(this.senderId, this.newGroupName, this.selectedUserIds).subscribe({
          next: (group: Group) => {
            this.showGroupForm = false;
            this.groups.push(group);
            this.newGroupName = '';
            this.selectedUserIds = [];
            
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
          }
        });
      }
    }

    selectGroup(groupId: string) {
      this.selectedGroup = this.groups.find(group => group.id === groupId) || null;
      this.receiverId = groupId;
      this.roomId = groupId;
      // this.loadGroupMessages(groupId);
      this.subscribeToGroupMessages(groupId);
    }

    // loadGroupMessages(groupId: string) {
    //   this.chatService.getGroupMessages(groupId).subscribe({
    //     next: (res) => {
    //       this.messages = res.messages;
    //     }
    //   });
    // }

    subscribeToGroupMessages(groupId: string) {
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
    
      this.messageSubscription = this.chatService.receiveGroupMessage(groupId).subscribe((message: any) => {
        if (message.groupId === groupId) {
          this.messages.push(message);
          this.cdr.detectChanges();
        }
      });
    }
    
    sendGroupMessage() {
      if (this.newMessage.trim() && this.roomId) {
        const newMessageObject: ChatMessage = {
          message: this.newMessage,
          senderId: this.senderId,
          senderName: this.sendername,
          receiverId: this.roomId,  // Use roomId here to represent the group
          timestamp: new Date(),
          _id: '',
          roomId: this.roomId
        };
    
        this.chatService.sendGroupMessage(this.senderId, this.roomId, this.newMessage);
        this.messages.push(newMessageObject);
        this.newMessage = '';
      }
    }
    

    getUnreadCountForUser(userId: string): number {
      return this.unreadMessageCounts.get(userId)?.count || 0;
    }
  
    


    logout(){
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_id')
      this.router.navigate([''])
    }
  

    selectedUserFunction(userid: any) {
      // Clear the messages array to avoid showing previous user's messages
      this.messages = [];
  
      this.unreadMessagesCount = this.unreadMessageCounts.get(userid)?.count || 0;
      if (this.unreadMessageCounts.has(userid)) {
        this.unreadMessageCounts.set(userid, { count: 0, isRead: true });
      }
      this.receiverId = userid;
      const selecteduser = this.clients.find((user) => user.id === userid);
      if (selecteduser) {
        this.selectedUser = selecteduser;
      }
  
      // Set the current room ID
      this.roomId = this.generateRoomId(this.senderId, this.receiverId);
      // this.joinRoom();
      this.subscribeToMessages();
      this.loadMessage();
    }

    private subscribeToMessages() {

      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
  
      this.messageSubscription = this.chatService.receiveMessage().subscribe((message: any) => {

  
        const formattedMessage = {
          message: message.message,
          receiverId: message.receiverId,
          senderId: message.senderId,
          senderName: message.sendername,
          timestamp: message.timestamp,
          isRead: message.isRead,
          _id: message._id,
          roomId: message.roomId
        };
  

        
        
  
          // Ensure the message is for the current room
      if (formattedMessage.roomId !== this.roomId) {
        // Increase unread count for the sender if the message is not for the current room
        const currentStatus = this.unreadMessageCounts.get(formattedMessage.senderId) || { count: 0, isRead: false };
        this.unreadMessageCounts.set(formattedMessage.senderId, { count: currentStatus.count + 1, isRead: false });
        return;
      }
  
      // Mark message as read if it is for the current room
      if (formattedMessage.senderId === this.receiverId) {
        formattedMessage.isRead = true;
      }
  
      this.messages.push(formattedMessage);
      this.cdr.detectChanges(); // Manually trigger change detection
      });
    }
  


  

    generateRoomId(userId1: string, userId2: string): string {
    console.log('roomId: ', [userId1, userId2].sort().join('_'))
    return [userId1, userId2].sort().join('_');
  }

  loadMessage(){
    this.chatService.getMessages(this.receiverId,this.senderId).subscribe({
      next:(res) =>{
        console.log('response messages: ', res.messages);
        this.messages = [...this.messages,...res.messages]
        console.log('messages: ',this.messages)
      }
    })
  }

  // joinRoom(roomId: string) {
  //   console.log('Joining room with ID:', roomId);
  //   this.chatService.joinRoom(roomId);
  // }


  joinRoom() {
    if (this.senderId) {
      this.clients.forEach(client => {
        if (client.id) {
          const roomId = this.generateRoomId(this.senderId, client.id);
          this.chatService.joinRoom(roomId);
          console.log('joined room for user and trainer:', roomId);
        } else {
          console.warn('Client without id encountered:', client);
        }
      });

    } else {
      console.warn('senderId is not set');
    }



    // this.chatService.receiveMessage().subscribe((message) => {
    //   console.log("This is the message im waiting for",message)
    //   this.messages.push(message)
    // });
  }

  


  sendMessage() {
    if (this.newMessage.trim() && this.receiverId && this.senderId) {
      console.log('This is the senderId',this.senderId);
      
      const newMessageObject: ChatMessage = {
        message: this.newMessage,
        senderId: this.senderId!,
        receiverId: this.receiverId,
        senderName: this.sendername,
        timestamp: new Date(),
        _id: '',
        roomId: this.roomId
      };
      console.log('This is what i want to fulfill',newMessageObject);
      
      this.chatService.sendMessage(this.senderId!, this.receiverId, this.newMessage, this.roomId, this.sendername);
      this.messages.push(newMessageObject);
      this.newMessage = '';
    }
  }

  createGroupChat(){
    
  }

}
