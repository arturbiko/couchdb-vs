import React from 'react';

export interface Configuraiton {
    disabled?: boolean;
}

export interface Value {
    id: number;
    value: string;
    label: string;
}

const Select: React.FC<{ options: Value[], onSelect: Function, config: Configuraiton }> = ({ options, onSelect, config }) => {

    return (
        <select onChange={(e) => onSelect(e.target.value)} disabled={config.disabled}>
             {options.map(option => {
                return (
                    <option key={option.id} value={option.value}>{option.label}</option>
                )
             })}
        </select>
    )
}

export default Select;