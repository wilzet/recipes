'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { UserResponse, UserUI } from '@/types/user';
import { LeaderboardResponse } from '@/types/leaderboard';
import apiRequest from '@/lib/api-request';
import Main from '@/components/main';
import Leaderboard from '@/components/leaderboard';
import Button from '@/components/button';
import Grid from '@/components/grid';
import AnimateHeight from '@/components/animate-height';
import Modal from '@/components/modal';
import UserForm from '@/components/user-form';
import Calendar from '@/components/calendar';
import Profile from '@/components/profile';

const defaultWelcome = 'Please select a user';

export default function Page() {
  const [selectedUser, setSelectedUser] = useState<UserUI | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(defaultWelcome);
  const [leaderboard, setLeaderboard] = useState<UserUI[]>([]);
  const [userForm, setUserForm] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);

  const searchUser = useSearchParams().get('user');
  const { replace } = useRouter();

  useEffect(() => {
    const asyncCall = async () => {
      await fetchLeaderboard();

      if (searchUser) {
        await fetchUser(searchUser);
        replace('/');
      }
    }

    asyncCall();
  }, []);

  const users = useMemo(() => {
    return leaderboard.length > 0 ? leaderboard.toSorted((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0;
    }) : [];
  }, [leaderboard]);

  const fetchLeaderboard = async () => {
    const response = await apiRequest<LeaderboardResponse>('/api/leaderboard');

    if (response && !response.error) {
      setLeaderboard(response.leaderboard ?? []);
    }
  }

  const fetchUser = async (username: string) => {
    const response = await apiRequest<UserResponse>(`/api/users/${username}`);

    if (response && response.user && !response.error)
    {
      setUser(response.user);
    }
  }

  const setUser = (user: UserUI) => {
    setWelcomeMessage(`Logged in as ${user?.name}!`);
    setSelectedUser(user);
  }

  const logOut = async () => {
    setWelcomeMessage(defaultWelcome);
    setSelectedUser(null);
    await fetchLeaderboard();
  }

  const renderUserButton = (user: UserUI, index: number) => {
    return (
      <div key={index} className='users-grid-item'>
        <Button
          value={user.name}
          class={'buttonFixedSize'}
          active={true}
          onClick={() => fetchUser(user.name)}
        />
      </div>
    );
  }

  const closeUserForm = async (user: UserUI | undefined) => {
    setUserForm(false);
    if (user)
    {
      await fetchLeaderboard();
      setUser(user);
    }
  }

  return (
    <Main>
      <div className='containerH left'>
        {selectedUser ? <Button
          value={'View profile'}
          class={'buttonBlue'}
          active={true}
          onClick={() => setProfile(true)}
        /> : <Button
          value={'New user'}
          class={'buttonGreen'}
          active={true}
          onClick={() => setUserForm(true)}
        />}
        <Button
          value={'Log Out'}
          class={'buttonRed'}
          active={selectedUser ? true : false}
          onClick={logOut}
        />
      </div>
      <h3>{welcomeMessage}</h3>
      {users.length > 0 && <AnimateHeight
        class={'users-container'}
        duration={500}
        heightHook={() => useMemo(() => {return selectedUser ? '0px' : 'max(100px, 60vh)'}, [selectedUser])}
      >
        <Grid<UserUI>
          class='users-grid-container'
          data={users}
          element={renderUserButton}
        />
      </AnimateHeight>}

      <Calendar
        selectedUsername={selectedUser?.name}
      />
      <Leaderboard
          selectedUserName={selectedUser?.name}
          leaderboard={leaderboard}
      />

      <Modal active={userForm}>
        <UserForm
          callback={closeUserForm}
        />
      </Modal>

      <Modal active={profile}>
        <Profile
          user={selectedUser}
          callback={() => setProfile(false)}
        />
      </Modal>
    </Main>
  );
}
