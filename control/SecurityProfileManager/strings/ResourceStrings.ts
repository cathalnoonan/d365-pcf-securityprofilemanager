import { IInputs } from '../generated/ManifestTypes'

export class ResourceStrings {
    constructor (
        private context: ComponentFramework.Context<IInputs>
    ) {}

    get SecurityProfiles(): string {
        return this.context.resources.getString('SecurityProfiles')
    }

    get Loading(): string {
        return this.context.resources.getString('Loading')
    }

    get SaveTheRecord(): string {
        return this.context.resources.getString('SaveTheRecord')
    }
}