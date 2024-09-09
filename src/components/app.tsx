import { useState, useEffect, useMemo } from 'react';
import { UserResponse, UserUI } from '@/types/user';
import { LeaderboardRequest, LeaderboardResponse } from '@/types/leaderboard';
import apiRequest from '@/lib/api-request';
import useWindowDimensions from '@/lib/window';
import Leaderboard from '@/components/leaderboard';
import Button from '@/components/button';
import Modal from '@/components/modal';
import UserForm from '@/components/user-form';
import Calendar from '@/components/calendar';
import Profile from '@/components/profile';
import UsersGrid from '@/components/users-grid';
import HamburgerMenu from '@/components/hamburger-menu';
import SearchButton from '@/components/search-button';
import { PostUI } from '@/types/post';

const defaultMessage = 'Please select a user';

export default function App() {
    const [selectedUser, setSelectedUser] = useState<UserUI | null>(null);
    const [message, setMessage] = useState<string>(defaultMessage);
    const [leaderboard, setLeaderboard] = useState<UserUI[]>([]);
    const [users, setUsers] = useState<UserUI[]>([]);
    const [userForm, setUserForm] = useState<boolean>(false);
    const [profile, setProfile] = useState<boolean>(false);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const asyncCall = async () => {
            await fetchLeaderboard();
            await fetchAllUsers();
        }

        asyncCall();
    }, []);

    const fetchUsers = async (length?: number) => {
        const body: LeaderboardRequest = {
            length,
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        return await apiRequest<LeaderboardResponse>('/api/leaderboard', options);
    }

    const fetchLeaderboard = async () => {
        const response = await fetchUsers(10);

        if (response && !response.error) {
            setLeaderboard(response.leaderboard ?? []);
        }
    }

    const fetchAllUsers = async () => {
        const response = await fetchUsers();

        if (response && response.leaderboard) {
            setUsers(response.leaderboard.length > 0 ? response.leaderboard.toSorted((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                }

                return 0;
            }) : []);
        }
    }

    const fetchUser = async (username: string) => {
        const response = await apiRequest<UserResponse>(`/api/users/${username}`);

        if (response && response.user && !response.error) {
            setUser(response.user);
        }
    }

    const setUser = (user: UserUI) => {
        setMessage(`Logged in as ${user.name}!`);
        setSelectedUser(user);
    }

    const updateUser = async () => {
        if (selectedUser) await fetchUser(selectedUser.name);
    }

    const logOut = async () => {
        setMessage(defaultMessage);
        setSelectedUser(null);
        await fetchAllUsers();
    }

    const closeUserForm = async (user: UserUI | undefined) => {
        setUserForm(false);
        if (user) {
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
        <div className='main' id='main'>
            <HamburgerMenu
                centerText={message}
                width={width}
                triggerWidth={875}
            >
                <SearchButton
                    user={selectedUser}
                    callback={function (post: PostUI) {
                        throw new Error('Function not implemented.');
                    }}
                />
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

            <h3>{message}</h3>
            <UsersGrid
                active={selectedUser ? true : false}
                users={users}
                onClick={fetchUser}
                style={width < 1400 ? {} : { position: 'absolute', zIndex: 10, left: 'min(max(calc(15%), calc(50% - 800px)), calc(50% - 558px))', top: '260px', transform: 'translateX(-50%)' }}
                gridStyle={width < 1400 ? {} : { gridTemplateColumns: width < 2000 ? 'repeat(1, max(min(200px, 24vw), 93px))' : 'repeat(2, max(min(200px, 24vw), 93px))' }}
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
        </div>
    );
}