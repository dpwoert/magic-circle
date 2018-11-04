const slug = str => str
    .replace(/\s/g, '-')
    .replace(/[%()=:.,!#$@"'/\\|?*+&]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();

export default slug;
