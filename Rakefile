#!/usr/bin/env rake

task :default do
  #check 'uglifyjs', 'UglifyJS', 'https://github.com/mishoo/UglifyJS2'
  puts 'LOG: default task'
end

# Check for the existence of an executable.
def check(exec, name, url)
  return unless `which #{exec}`.empty?
  puts "#{name} not found.\nInstall it from #{url}"
  exit
end