import React from 'react';
import { makeStyles } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers';
import DatePickerTextField from './DatePickerTextField';
import * as util from './util';

const useStyles = makeStyles((theme) => ({
    datePicker: {
        width: 110,
        marginRight: theme.spacing(1),
    },
}))

function CustomDatePicker({name, dateValue, changeHandler, label, clearable, errorProps}) {
    const styles = useStyles();
    return(
        <DatePicker
            format={util.dateFormat}
            label={label}
            disableFuture
            autoOk
            clearable={clearable}
            allowKeyboardControl
            TextFieldComponent={({onClick, value}) =>
                <DatePickerTextField 
                    onClick={onClick} 
                    value={value} 
                    label={label} 
                    className={styles.datePicker}
                    errorProps={errorProps}
                />
            }
            value={dateValue}
            onChange={(value) => changeHandler(value, name)}
        />
    )
}

export default CustomDatePicker;