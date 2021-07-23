import { Checkbox } from '@fluentui/react/lib/components/Checkbox/Checkbox'
import { ICheckboxProps } from '@fluentui/react/lib/components/Checkbox/Checkbox.types'
import { Stack } from '@fluentui/react/lib/components/Stack/Stack'
import { IStackProps } from '@fluentui/react/lib/components/Stack/Stack.types'
import * as React from 'react'
import { SecurityProfileData, SecurityProfileMap } from './SecurityProfileData'

export interface SecurityProfileToggleProps {
    securityProfile: SecurityProfileMap
    data: SecurityProfileData
}

export const SecurityProfileToggle = (props: SecurityProfileToggleProps): JSX.Element => {
    const { data, securityProfile } = props

    const [checked, setChecked] = React.useState<boolean>(props.securityProfile.assigned)
    const [loading, setLoading] = React.useState<boolean>(false)

    const stackProps: IStackProps = {
        horizontal: true,
    }

    const checkboxProps: ICheckboxProps = {
        checked,
        label: securityProfile.name,
        onChange: async (ev?: React.FormEvent, changedToChecked?: boolean) => {
            if (typeof checked === 'undefined') return

            try {
                setLoading(true)
    
                if (changedToChecked) {
                    await data.associateSecurityProfile(securityProfile.id)
                    setChecked(changedToChecked)
                } else {
                    await data.disassociateSecurityProfile(securityProfile.id)
                    setChecked(changedToChecked ?? false)
                }
            } finally {
                setLoading(false)
            }
        },
    }

    return (
        <Stack {...stackProps}>
            <Checkbox {...checkboxProps} disabled={loading} />
        </Stack>
    )
}