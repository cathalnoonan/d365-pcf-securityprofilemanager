import { IInputs, IOutputs } from './generated/ManifestTypes'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { SecurityProfileManager as App } from './SecurityProfileManager'
import { SecurityProfileData } from './SecurityProfileData'
import { ResourceStrings } from './strings/ResourceStrings'
export class SecurityProfileManager implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private container: HTMLDivElement

	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement): void {

		this.container = container
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {

		const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl()
		const { entityTypeName, entityId } = context.mode.contextInfo
		const data = new SecurityProfileData(clientUrl, entityTypeName!, entityId!)
		const resourceStrings = new ResourceStrings(context)

		ReactDOM.render(
			React.createElement(App, { entityId, data, resourceStrings }),
			this.container
		)
	}

	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this.container)
	}
}
