import React, { useState } from "react";
import Button from "@/components/button";
import Modal from '@/components/modal';

export default function SearchButton() {
    const [searchForm, setSearchForm] = useState<boolean>(false);

    const closeSearch = () => {
        setSearchForm(false);
    }

    return (
        <div id='search' style={{ alignSelf: 'end' }}>
            <Button
                value={'Search'}
                active={true}
                class='buttonBlue'
                onClick={() => setSearchForm(true)}
                style={{
                    marginBottom: '10px',
                    padding: '5px',
                    paddingLeft: '27px',
                    position: 'relative'
                }}
            >
                <div className='search-icon' />
            </Button>

            <Modal active={searchForm} parent='search'>
                <Button
                    value={'close'}
                    active={true}
                    onClick={closeSearch}
                />
            </Modal>
        </div>
    );
}