require 'yaml'
require 'json'
require 'fileutils'
require 'date'

# Load Jekyll configuration
config_file = '_config.yml'
config = YAML.load_file(config_file)

# Collections from the Jekyll site configuration
collections = config['collections'].keys rescue []

# Define output directory and file (within the source folder, not _site)
output_dir = File.join('assets', 'json')
output_file = File.join(output_dir, 'search.json')

# Ensure the output directory exists
FileUtils.mkdir_p(output_dir)

# Prepare data for the search index
data = []
collections.each do |collection|
  collection_dir = File.join('_site', collection)
  Dir.glob(File.join(collection_dir, '*.html')).each do |file_path|
    next unless File.exist?(file_path)

    # Extract content from file
    content = File.read(file_path)
    title = content[%r{<title>(.*?)</title>}m, 1] || "Untitled"
    defined_date = content[%r{<meta name="date" content="(.*?)" />}m, 1]
    file_date = File.mtime(file_path).strftime("%B %d, %Y") rescue "Unknown Date"
    final_title = title || defined_date || file_date || 'Untitled'

    data << {
      id: File.basename(file_path, '.html'),
      title: final_title,
      content: content.strip,
      url: file_path.sub('_site/', ''),
      date: defined_date || file_date,
      category: collection
    }
  end
end

# Write the search index to a JSON file
File.write(output_file, JSON.pretty_generate(data))
puts "Search index generated at #{output_file}"
