import React from 'react';
import { UserUI } from '@/types/user';

interface LeaderboardComponentProps {
    selectedUserName?: string,
    style?: React.CSSProperties,
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
        <div className='leaderboard-container' style={props.style}>
            <h2 style={{ marginBottom: '2px', paddingBottom: '0px' }}>Leaderboard</h2>
            <table style={{ fontSize: 'large' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-gray)' }}>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {props.leaderboard.map((user, index) => renderUser(user, index))}
                </tbody>
            </table>
        </div>
    ) : "";
}