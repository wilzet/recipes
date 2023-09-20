'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import Grid from '@/components/grid';
import AnimateHeight from '@/components/animate-height';

const defaultWelcome = 'Please select a user';

export default function Page() {
  const [selectedUser, setSelectedUser] = useState<UserUI | null>();
  const [welcomeMessage, setWelcomeMessage] = useState<string>(defaultWelcome);
  const [leaderboard, setLeaderboard] = useState<UserUI[]>([]);
  const searchUser = useSearchParams().get('user');
  const { push, replace } = useRouter();

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
    return leaderboard.toSorted((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }, [leaderboard]);

  const fetchLeaderboard = async () => {
    const response = await fetch('api/leaderboard')
      .then(res => res.json())
      .catch(e => console.log(e));

    if (response && !response.error) {
      setLeaderboard(response.leaderboard);
    }
  }

  const fetchUser = async (username: string) => {
    const response = await fetch(`api/users/${username}`)
      .then(res => res.json())
      .catch(e => console.log(e));

    if (response && !response.error) 
    {
      setWelcomeMessage(`Logged in as ${response.user.name}!`);
      setSelectedUser(response.user);
    }
  }

  const logOut = async () => {
    setWelcomeMessage(defaultWelcome);
    setSelectedUser(null);
    await fetchLeaderboard();
  }

  const makePost = async (amount: number) => {
    if (!selectedUser || selectedUser.score + amount < 0) return;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: selectedUser.name, score: amount })
    };
    const response = await fetch(`api/recipes/create`, options)
      .then(res => res.json())
      .catch(e => console.log(e));

    if (response && !response.error) {
      setSelectedUser(response.user);
      setLeaderboard(response.leaderboard);
    }
  }

  const renderUser = (user: UserUI) => {
    const color = selectedUser && selectedUser.name === user.name ? 'var(--color-gray)' : 'inherit';
    return (
      <tr key={user.name} style={{backgroundColor: color}}>
        <td>{user.name}</td>
        <td>{user.score}</td>
      </tr>
    );
  }

  const renderUserButton = (user: UserUI, index: number) => {
    return (
      <div key={index} className='grid-item'>
        <Button
          value={user.name}
          class={'buttonFixedSize'}
          active={true}
          onClick={() => fetchUser(user.name)}
        />
      </div>
    );
  }

  const createUser = () => {
    push('/new');
  }

  return (
    <div className='main'>
      <h3>{welcomeMessage}</h3>
      <div className='containerH'>
        <Button
          value={'New user'}
          class={'buttonGreen'}
          active={true}
          onClick={() => createUser()}
        />
        <Button
          value={'Log Out'}
          class={'buttonRed'}
          active={selectedUser ? true : false}
          onClick={() => logOut()}
        />
      </div>
      {users.length > 0 && <AnimateHeight
        class={'users-container'}
        duration={500}
        heightHook={() => useMemo(() => {return selectedUser ? '0px' : 'max(100px, 60vh)'}, [selectedUser])}
      >
        <Grid<UserUI>
          data={users}
          element={renderUserButton}
          active={selectedUser ? false : true}
        />
      </AnimateHeight>}
      {selectedUser && <div className='containerH'>
        <Button
          value={'Make post'}
          class={'buttonBlue'}
          active={true}
          onClick={() => makePost(1)}
        />
        <Button
          value={'Remove post'}
          class={'buttonRed'}
          active={true}
          onClick={() => makePost(-1)}
        />
      </div>}
      {leaderboard.length > 0 && <div className='containerV'>
        <h2>Leaderboard</h2>
        <table style={{fontSize: 'large'}}>
          <thead>
            <tr style={{backgroundColor: '#cccccc', color: '#2d2d3d'}}>
              <th>Name</th>
              <th>Contributions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user: UserUI) => (
              renderUser(user)
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
