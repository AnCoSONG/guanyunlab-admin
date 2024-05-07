declare type User = {
    id: string;
    username: string;
}

declare type Metadata = {
    id: string,
    about_heros: UploadFile[],
    contact_hypertext: string
}

declare type Publication = {
    id: string;
    img: string;
    authors: string;
    title: string;
    venue: string;
    href: string;
    published_at: string;
    create_date: string;
}

declare type PublicationWithoutAutoKey = Omit<Omit<Publication, 'id'>, 'create_date'>

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
    hero_priority: number;
    create_date_real: string;
    update_date: string;
}

declare type ProjectWithoutAutoKey = Omit<Omit<Omit<Project, 'id'>, 'create_date_real'>, 'update_date'>
declare enum MemberRole {
    student = 'student',
    teacher = 'teacher',
    intern = 'intern',
    graduate = 'graduate',
    postdoc = 'postdoc',
    ra = 'ra',
}

declare type Member = {
    id: string;
    avatar: string;
    hero_avatar: string;
    identity: MemberRole;
    cn_name: string;
    en_name: string;
    cn_title: string;
    en_title: string;
    hypertext?: string;
    priority: number;
    create_date: string;
    update_date: string;
}

declare type MemberWithoutAutoKey = Omit<Omit<Omit<Member, 'id'>, 'create_date'>, 'update_date'>


declare type News = {
    id: string;
    title: string;
    last_date: string;
    hypertext: string;
}

declare type NewsWithoutAutoKey = {
    title: string;
    hypertext: string;
}