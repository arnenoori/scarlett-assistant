import React from 'react';
export interface IPortalProps {
    id?: string | symbol;
}
export declare const createPortalProvider: (id: string | symbol) => {
    (props: React.PropsWithChildren<IPortalProps>): JSX.Element;
    defaultProps: {
        id: string | symbol;
    };
};
export declare function createPortalRoot<T extends React.ReactNode>(host: HTMLElement, id: string): {
    render: (renderer?: () => T) => void;
    unmount: () => void;
};
