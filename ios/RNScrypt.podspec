require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|

  s.name           = package['name']
  s.version        = package['version']
  s.summary        = package['description']
  s.homepage       = package['repository']['url']
  s.license        = package['license']
  s.author         = package['author']
  s.source         = { :git => s.homepage, :tag => 'v#{s.version}' }

  s.requires_arc   = true
  s.ios.deployment_target = '7.0'

  s.preserve_paths = 'README.md', 'package.json'
  s.source_files   = '**/*.{h,m}'

end
