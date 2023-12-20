'use client'
import { useState, useEffect, useMemo } from 'react';
import { UserResponse, UserUI } from '@/types/user';
import { LeaderboardRequest, LeaderboardResponse } from '@/types/leaderboard';
import apiRequest from '@/lib/api-request';
import useWindowDimensions from '@/lib/window';
import Main from '@/components/main';
import Leaderboard from '@/components/leaderboard';
import Button from '@/components/button';
import Modal from '@/components/modal';
import UserForm from '@/components/user-form';
import Calendar from '@/components/calendar';
import Profile from '@/components/profile';
import UsersGrid from '@/components/users-grid';
import HamburgerMenu from '@/components/hamburger-menu';

const defaultWelcome = 'Please select a user';

export default function Page() {
  const [selectedUser, setSelectedUser] = useState<UserUI | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(defaultWelcome);
  const [leaderboard, setLeaderboard] = useState<UserUI[]>([]);
  const [userForm, setUserForm] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const asyncCall = async () => {
      await fetchLeaderboard();
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
    let body: LeaderboardRequest = {
      length: 10,
    }

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const response = await apiRequest<LeaderboardResponse>('/api/leaderboard', options);

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

  const updateUser = async () => {
    if (selectedUser) await fetchUser(selectedUser.name);
  }

  const logOut = async () => {
    setWelcomeMessage(defaultWelcome);
    setSelectedUser(null);
  }

  const closeUserForm = async (user: UserUI | undefined) => {
    setUserForm(false);
    if (user)
    {
      await fetchLeaderboard();
      setUser(user);
    }
  }

  const closeProfile = async () => {
    setProfile(false);
    await fetchLeaderboard();
    await updateUser();
  }

  return (
    <Main>
      <HamburgerMenu
        centerText={welcomeMessage}
        width={width}
        hamburgerTriggerWidth={800}
      >
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
      </HamburgerMenu>
      <UsersGrid
        active={selectedUser ? true : false}
        users={users}
        onClick={fetchUser}
      />

      <Calendar
        selectedUser={selectedUser ?? undefined}
        update={closeProfile}
      >
        <Leaderboard
          selectedUserName={selectedUser?.name}
          style={width < 1400 ? {} : { position: 'absolute', left: 'max(min(calc(85%), calc(50% + 800px)), calc(50% + 558px))', top: '220px', transform: 'translate(-50%, -50%)' }}
          leaderboard={leaderboard}
        />
      </Calendar>

      <Modal active={userForm}>
        <UserForm
          callback={closeUserForm}
        />
      </Modal>

      <Modal active={profile}>
        <Profile
          user={selectedUser}
          update={updateUser}
          callback={closeProfile}
        />
      </Modal>
    </Main>
  );
}
