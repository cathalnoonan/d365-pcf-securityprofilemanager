import { XrmHttpService } from './XrmHttpService'

const API_VERSION = 'v9.1'

export class SecurityProfileData {

    private readonly xrmHttpService: XrmHttpService

    constructor(
        private readonly clientUrl: string,
        private readonly entityTypeName: string,
        private readonly entityId: string
    ) {
        this.xrmHttpService = new XrmHttpService(`${clientUrl}/api/data/${API_VERSION}`)
    }

    public getSecurityProfileMap = async (): Promise<SecurityProfileMap[]> => {
        const assigned = await this.getAssignedSecurityProfiles()
        const all = await this.getAllSecurityProfiles()

        const assignedIds = assigned.map(item => item.id)

        const merged = all.map(item => ({
            assigned: assignedIds.includes(item.id),
            ...item,
        }))

        return merged
    }

    public associateSecurityProfile = async (id: string): Promise<void> => {
        // POST /api/data/v9.0/systemusers(00000000-0000-0000-0000-000000000002)/systemuserprofiles_association/$ref
        //
        // {
        //    "@odata.id":"[Organization URI]/api/data/v9.0/fieldsecurityprofiles(00000000-0000-0000-0000-000000000001)"
        // }

        const entitySetName = this.getCurrentEntitySetName()
        const associationName = this.getAssociationName()
        const url = `${this.clientUrl}/api/data/${API_VERSION}/${entitySetName}(${this.entityId})/${associationName}/$ref`
        const data = {
            '@odata.id': `${this.clientUrl}/api/data/${API_VERSION}/fieldsecurityprofiles(${id})`
        }

        console.log('SecurityProfileManager associateSecurityProfile', { method:'POST', url, data })

        return await this.xrmHttpService.POST(url, data)
    }

    public disassociateSecurityProfile = async (id: string): Promise<void> => {
        // DELETE /api/data/v9.0/systemusers(00000000-0000-0000-0000-000000000002)/systemuserprofiles_association(00000000-0000-0000-0000-000000000001)/$ref

        const entitySetName = this.getCurrentEntitySetName()
        const associationName = this.getAssociationName()
        const url = `${this.clientUrl}/api/data/${API_VERSION}/${entitySetName}(${this.entityId})/${associationName}(${id})/$ref`

        console.log('SecurityProfileManager disassociateSecurityProfile', { method:'DELETE', url })

        return await this.xrmHttpService.DELETE(url)
    }

    private getAllSecurityProfiles = async (): Promise<SecurityProfile[]> => {
        // GET /api/data/v9.1/fieldsecurityprofiles?$select=fieldsecurityprofileid,name&$orderby=name%20asc

        const url = `${this.clientUrl}/api/data/${API_VERSION}/fieldsecurityprofiles?$select=name,fieldsecurityprofileid&$orderby=name asc`

        console.log('SecurityProfileManager getAllSecurityProfiles', { method:'GET', url })

        const result = await this.xrmHttpService.GET<{ value: any[] }>(url)

        const securityProfiles = result.value.map((entity: any) => ({
            id: entity.fieldsecurityprofileid,
            name: entity.name,
        }))

        return securityProfiles
    }

    private getAssignedSecurityProfiles = async (): Promise<SecurityProfile[]> => {
        // GET /api/data/v9.1/systemusers(00000000-0000-0000-0000-000000000000)/systemuserprofiles_association

        const currentEntitySetName = await this.getCurrentEntitySetName()
        const associationName = this.getAssociationName()
        const url = `${this.clientUrl}/api/data/${API_VERSION}/${currentEntitySetName}(${this.entityId})/${associationName}`

        console.log('SecurityProfileManager getAssignedSecurityProfiles', { method:'GET', url })

        const result = await this.xrmHttpService.GET<{ value: any[] }>(url)

        const securityProfiles = result.value.map((entity: any) => ({
            id: entity.fieldsecurityprofileid,
            name: entity.name,
        }))

        return securityProfiles
    }

    private getAssociationName = (): string => {
        // May as well hard code this.
        // There are only two supported entities for the fieldsecurityprofile associations.

        if (this.entityTypeName === 'systemuser') return 'systemuserprofiles_association'
        if (this.entityTypeName === 'team') return 'teamprofiles_association'

        throw Error('Unexpected entity type')
    }

    private getCurrentEntitySetName = (): string => {
        // May as well hard code this.
        // There are only two supported entities for the fieldsecurityprofile associations.

        if (this.entityTypeName === 'systemuser') return 'systemusers'
        if (this.entityTypeName === 'team') return 'teams'

        throw Error('Unexpected entity type')
    }
}

export interface SecurityProfile {
    id: string
    name: string
}

export interface SecurityProfileMap extends SecurityProfile {
    assigned: boolean
}
