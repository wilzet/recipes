import React from 'react';
import { UserUI } from '@/types/user';

interface LeaderboardComponentProps {
    selectedUserName?: string,
    leaderboard: UserUI[],
}

export default function Leaderboard(props: LeaderboardComponentProps) {
    const renderUser = (user: UserUI, index: number) => {
        const color = props.selectedUserName === user.name ? 'var(--color-gray)' : 'inherit';
        return (
            <tr key={index} style={{backgroundColor: color}}>
                <td>{user.name}</td>
                <td>{user.score}</td>
            </tr>
        );
    }

    return props.leaderboard.length > 0 ? (
        <div className='containerV'>
            <h2 style={{marginBottom: '2px', paddingBottom: '0px'}}>Leaderboard</h2>
            <table style={{fontSize: 'large'}}>
                <thead>
                    <tr style={{backgroundColor: '#cccccc', color: '#2d2d3d'}}>
                        <th>Name</th>
                        <th>Contributions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.leaderboard.map((user, index) => renderUser(user, index))}
                </tbody>
            </table>
        </div>
    ) : "";
}