# Initialize default meta tags.
# Important: as any file in the config/initializers folder, it is loaded when your app is launched. Any time you change the content in meta.yml, restart your rails s to refresh DEFAULT_META!

DEFAULT_META = YAML.load_file(Rails.root.join("config/meta.yml"))
