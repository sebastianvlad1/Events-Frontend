enum Icon {
    Party = 'party.png',
    User = 'user-location.png',
}

const iconPath = '/assets/';

interface IconPaths {
    [key: string]: string;
}

const iconPaths: IconPaths = {
    party: `${iconPath}${Icon.Party}`,
    user: `${iconPath}${Icon.User}`,
};

export default iconPaths;
