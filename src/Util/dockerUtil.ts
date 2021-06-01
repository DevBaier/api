import { Console } from 'console';
import * as Docker from 'dockerode';
import { Container, ContainerInfo, Network, NetworkInspectInfo } from 'dockerode';

const { GITHUB_USER, GITHUB_PASSWORD, GITHUB_SERVERADDRESS } = require('../endpoints.config');

const docker: Docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

const auth = {
    username: GITHUB_USER,
    password: GITHUB_PASSWORD,
    serveraddress: GITHUB_SERVERADDRESS
}

export async function createContainer(imageName: string, containerName: string): Promise<Container> {

    let container: Container = await getContainerByName(containerName);
    if(container) {
        await docker.pull(`ghcr.io/${imageName.toLowerCase()}:latest`, auth);
        console.log('Image pulled')

        await container.stop();
        console.log('Container stopped')
        await container.rename({name: `${containerName}-old`});
        console.log('Container renamed')

        const newContainer: Container = await docker.createContainer({
            Image: `ghcr.io/${imageName.toLowerCase()}:latest`,
            name: containerName,
            NetworkingConfig: {
                EndpointsConfig: {
                    'traefik_traefik': {
                        NetworkID: (await getNetworkByName('traefik_traefik')).id
                    }
                }
            }
        });
        console.log('Container created')

        await newContainer.start();
        console.log('Container started');
        (async () => await container.remove())();
        console.log('Container removed');

        container = newContainer;

    } else {

        await docker.pull(`ghcr.io/${imageName.toLowerCase()}:latest`, auth);
        console.log('Image pulled')
        
        container = await docker.createContainer({
            Image: `ghcr.io/${imageName.toLowerCase()}:latest`,
            name: containerName,
            NetworkingConfig: {
                EndpointsConfig: {
                    'traefik_traefik': {
                        NetworkID: (await getNetworkByName('traefik_traefik')).id
                    }
                }
            }
        });
        console.log('Container created')

        await container.start();
        console.log('Container started');

    }

    return container;

}

export async function getNetworkByName(name: string): Promise<Network> {
    return new Promise<Network>((resolve: (network: Network) => void, reject: (error: Error) => void): void => {
        docker.listNetworks({
            "limit": 1,
            "filters": `{"name": ["${name}"]}`
        }, (err: Error, networks: Array<NetworkInspectInfo>): void => {
            if(err) {
                reject(err)
            } else{
                resolve(networks && networks[0] && docker.getNetwork(networks[0].Id));
            }
        });
    })
}

export async function getContainerByName(name: string): Promise<Container> {
    return new Promise<Container>((resolve: (container: Container) => void, reject: (error: Error) => void): void => {
        docker.listContainers({
            "limit": 1,
            "filters": `{"name": ["${name}"]}`
        }, (err: Error, containers: Array<ContainerInfo>): void => {
            if(err) {
                reject(err)
            } else{
                resolve(containers && containers[0] && docker.getContainer(containers[0].Id));
            }
        });
    })
}