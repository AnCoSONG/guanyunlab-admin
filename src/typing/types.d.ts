declare type User = {
    id: string;
    username: string;
}

declare type Metadata = {
    id: string,
    about_heros: UploadFile[],
    recruit_hypertext: string,
    collaboration_sponsor_hypertext: string,
    lab_office_hypertext: string,
    info_hypertext: string
}

declare type Publication = {
    id: string;
    img: string;
    authors: string;
    title: string;
    venue: string;
    href: string;
    create_date: string;
}