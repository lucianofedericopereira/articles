require 'yaml'
require 'json'
require 'fileutils'
require 'date'

module Jekyll
  class SearchDataGenerator < Generator
    priority :lowest
    def generate(site)
      config_file = File.join(site.source, '_config.yml')
      config = YAML.load_file(config_file)
      collections = config['collections'].keys rescue []
      output_dir = File.join(site.dest, 'assets/json')
      output_file = File.join(output_dir, 'search.json')
      FileUtils.mkdir_p(output_dir)
      data = []
      collections.each do |collection|
        next unless site.collections[collection]
        site.collections[collection].docs.each do |doc|
          title = doc.data['title']
          defined_date = doc.data['date'] ? Date.parse(doc.data['date'].to_s).strftime("%B %d, %Y") : nil
          file_date = if File.exist?(doc.path)
            File.mtime(doc.path).strftime("%B %d, %Y")
          else
            "Unknown Date"
          end
          final_title = title || defined_date || file_date || 'Untitled'
          data << {
            id: doc.id,
            title: final_title,
            content: doc.content.strip,
            url: doc.url,
            date: defined_date || file_date,
            category: collection,
          }
        end
      end
      File.write(output_file, JSON.pretty_generate(data))
    end
  end
end
