import React from 'react';
import { TextField, Tooltip, makeStyles, withStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    inputFont: {
        fontSize: 14
    },
}))

const ErrorToolTip = withStyles(theme => ({
    tooltip: {
      backgroundColor: 'rgba(244, 67, 54, 0.87)',
      color: 'rgba(255, 255, 255, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
}))(Tooltip);

function DatePickerTextField({onClick, value, label, className, errorProps}) {  
    const styles = useStyles();  
    if (errorProps && errorProps.error) {
        return (
            <ErrorToolTip placement="top" title={errorProps.helperText}>
                <TextField
                    onClick={onClick}
                    value={value}
                    variant="outlined"
                    className={className}
                    margin="dense"
                    label={label}
                    size="small"
                    InputProps={{
                        classes: {
                            input: styles.inputFont
                        },
                    }}
                    error={errorProps ? errorProps.error : false}
                />
            </ErrorToolTip>
        )
    } else {
        return (
            <TextField
                onClick={onClick}
                value={value}
                variant="outlined"
                className={className}
                margin="dense"
                label={label}
                size="small"
                InputProps={{
                    classes: {
                        input: styles.inputFont
                    },
                }}
            />
        )
    }
}

export default DatePickerTextField;