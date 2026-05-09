export type UserPublic = {
  id: string;
  name: string;
  email: string;
};
export type ApiErrorResponse = {
  message: string;
};
export type UserProfile = UserPublic & {
  createdAt: string;
  updatedAt: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  user: UserPublic;
  token: string;
};

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  creator: UserPublic;
  participants: UserPublic[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  startedAt: string;
  address: string;
  capacity: number;
};

export type CreateEventRequest = {
  title: string;
  description: string;
  capacity: number;
  address: string;
  startedAt: string;
};
export type ParticipantsResponse = {
  participants: {
    id: string;
    name: string;
    email: string;
  }[];
};

export type UpdateEventRequest = Partial<CreateEventRequest>;

export type JoinEventResponse = {
  message: string;
  participant: {
    id: string;
    eventId: string;
    userId: string;
    joinedAt: string;
  };
};

export type JoinedEventItem = {
  joinedAt: string;
  event: Event;
};

export type JoinedEvent = Event | JoinedEventItem;
