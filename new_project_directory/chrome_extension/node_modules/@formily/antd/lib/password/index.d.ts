import React from 'react';
import { PasswordProps } from 'antd/lib/input';
export interface IPasswordProps extends PasswordProps {
    checkStrength: boolean;
}
export declare const Password: React.ForwardRefExoticComponent<Partial<IPasswordProps> & React.RefAttributes<unknown>>;
export default Password;
