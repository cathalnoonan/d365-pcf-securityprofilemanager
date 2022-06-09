import * as React from 'react'
import { SecurityProfileToggle } from './SecurityProfileToggle'
import { ResourceStrings } from './strings/ResourceStrings'
import { SecurityProfileData, SecurityProfileMap } from './SecurityProfileData'

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner'
import { Stack } from '@fluentui/react/lib/Stack'

export interface SecurityProfileManagerProps {
    entityId: string | null
    data: SecurityProfileData
    resourceStrings: ResourceStrings
}

export const SecurityProfileManager = (props: SecurityProfileManagerProps): JSX.Element => {
    const { entityId, data, resourceStrings } = props

    const [loading, setLoading] = React.useState<boolean>(!!entityId)
    const [error, setError] = React.useState<boolean>(false)
    const [securityProfiles, setSecurityProfiles] = React.useState<SecurityProfileMap[]>([])

    React.useEffect(() => {
        async function getDataMap() {
            try {
                const dataMap = await data.getSecurityProfileMap()
                setSecurityProfiles(dataMap)
                setError(false)
            } catch (e) {
                setSecurityProfiles([])
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        getDataMap()
    }, [entityId])
    
    function renderComponent(): JSX.Element {
        if (loading) return (
            <Spinner size={SpinnerSize.large} label={resourceStrings.Loading} />
        )
    
        if (error) return (
            <div>{resourceStrings.SaveTheRecord}</div>
        )
    
        return (
            <div style={{ height: '200px', position: 'relative' }}>
                <ScrollablePane>
                    <Stack tokens={{ childrenGap: 10 }}>
                        {securityProfiles.map((item, index) => <SecurityProfileToggle data={data} securityProfile={item} key={index} />)}
                    </Stack>
                </ScrollablePane>
            </div>
        )
    }

    return (
        <div>
            <h4>{resourceStrings.SecurityProfiles}</h4>
            <hr style={{backgroundColor: 'rgb(238, 238, 238)', height: '1px', margin: '5px 0px'}} />
            <div>
                {renderComponent()}
            </div>
        </div>
    )
} 