import React, { useMemo } from 'react';
import { UserUI } from '@/types/user';
import AnimateHeight from '@/components/animate-height';
import Button from '@/components/button';
import Grid from '@/components/grid';

interface UsersGridComponentProps {
    active: boolean,
    users: UserUI[],
    style?: React.CSSProperties,
    gridStyle?: React.CSSProperties,
    onClick: (user: string) => any, 
}

export default function UsersGrid(props: UsersGridComponentProps) {
  const userBoxHeight = useMemo(() => {return props.active ? '0px' : 'max(100px, 60vh)'}, [props.active]);

  const renderUserButton = (user: UserUI, index: number) => {
    return (
      <div key={index} className='users-grid-item'>
        <Button
          value={user.name}
          class={'buttonFixedSize'}
          active={true}
          onClick={() => props.onClick(user.name)}
        />
      </div>
    );
  }

  return (
    <>
        {props.users.length > 0 && <AnimateHeight
            class={'users-container'}
            duration={500}
            heightHook={() => userBoxHeight}
            style={props.style}
        >
          <Grid<UserUI>
              class='users-grid-container'
              data={props.users}
              element={renderUserButton}
              style={props.gridStyle}
          />
        </AnimateHeight>}
    </>
  );
}