// EditButton.tsx
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

type EditButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium';
  color?:
    | 'inherit'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  disabled?: boolean;
  tooltip?: string;
  'aria-label'?: string;
};

export default function EditButton({
  onClick,
  size = 'small',
  color = 'primary',
  disabled = false,
  tooltip = 'Edit',
  'aria-label': ariaLabel,
}: EditButtonProps) {
  return (
    <Tooltip title={tooltip} arrow>
      {/* span keeps the tooltip active when the IconButton is disabled */}
      <span>
        <IconButton
          size={size}
          color={color}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel ?? 'edit'}
        >
          {/* fontSize matches visually to the IconButton size */}
          <EditIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
