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

declare type Project = {
    id: string;
    cn_authors: string;
    en_authors: string;
    first_author: string;
    cn_name: string;
    en_name: string;
    short_abstract: string;
    en_abstract: string;
    cn_abstract: string;
    view_count: number;
    hero_img: string;
    hypertext: string;
    imgs: string[];
    create_date: string;
    create_date_real: string;
    update_date: string;
}